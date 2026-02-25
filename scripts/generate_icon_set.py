#!/usr/bin/env python3

"""
Generate the UnderPAR icon suite as smooth stainless + high-gloss liquid glass.

Default behavior generates rounded-rectangle icons only.
Round variants are optional via --include-round.
"""

from __future__ import annotations

import argparse
import subprocess
import sys
from pathlib import Path

import cv2
import numpy as np

DEFAULT_SIZES = [16, 24, 32, 48, 64, 72, 96, 128, 144, 152, 180, 192, 256, 384, 512, 1024, 2048, 4096]
ICO_SIZES = [16, 24, 32, 48, 64, 128, 256]
DEFAULT_TARGET = 8192
DEFAULT_BASE_RENDER = 4096


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Generate UnderPAR liquid-glass icon set.")
    parser.add_argument("--output-dir", default="icons", help="Output directory. Default: icons")
    parser.add_argument("--target", type=int, default=DEFAULT_TARGET, help=f"Master target size. Default: {DEFAULT_TARGET}")
    parser.add_argument(
        "--base-render",
        type=int,
        default=DEFAULT_BASE_RENDER,
        help=f"Procedural render size before optional upscale. Default: {DEFAULT_BASE_RENDER}",
    )
    parser.add_argument("--include-round", action="store_true", help="Also generate round icon variants.")
    return parser.parse_args()


def fail(message: str) -> None:
    print(f"[generate_icon_set] {message}", file=sys.stderr)
    sys.exit(1)


def write_png(path: Path, image: np.ndarray) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    ok = cv2.imwrite(str(path), image, [cv2.IMWRITE_PNG_COMPRESSION, 6])
    if not ok:
        fail(f"Failed to write {path}")


def make_ico(output_path: Path, png_paths: list[Path]) -> None:
    if not png_paths:
        return

    cmd = ["ffmpeg", "-y"]
    for icon_path in png_paths:
        cmd.extend(["-i", str(icon_path)])
    for idx in range(len(png_paths)):
        cmd.extend(["-map", str(idx)])
    cmd.append(str(output_path))

    try:
        subprocess.run(cmd, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    except FileNotFoundError:
        fail("ffmpeg is required to generate .ico files.")
    except subprocess.CalledProcessError as error:
        details = error.stderr.decode("utf-8", errors="replace").strip()
        fail(f"Failed to generate ICO {output_path}: {details}")


def resized(image: np.ndarray, size: int) -> np.ndarray:
    if image.shape[0] == size and image.shape[1] == size:
        return image
    return cv2.resize(image, (size, size), interpolation=cv2.INTER_AREA)


def create_superellipse_mask(size: int, exponent: float = 5.3, inset: int = 0, supersample: int = 2) -> np.ndarray:
    ss = max(1, int(supersample))
    hi_size = size * ss
    hi_inset = max(0, int(inset * ss))

    radius = (hi_size - 1) / 2.0 - hi_inset
    if radius <= 0:
        fail("Superellipse inset produced invalid geometry.")

    samples = max(768, int(hi_size * 2.0))
    t = np.linspace(0.0, 2.0 * np.pi, samples, endpoint=False, dtype=np.float64)
    ct = np.cos(t)
    st = np.sin(t)
    x = np.sign(ct) * np.power(np.abs(ct), 2.0 / exponent)
    y = np.sign(st) * np.power(np.abs(st), 2.0 / exponent)

    cx = (hi_size - 1) / 2.0
    cy = (hi_size - 1) / 2.0
    pts = np.stack([cx + radius * x, cy + radius * y], axis=1)
    pts = np.round(pts).astype(np.int32).reshape((-1, 1, 2))

    mask_hi = np.zeros((hi_size, hi_size), dtype=np.uint8)
    cv2.fillPoly(mask_hi, [pts], 255, lineType=cv2.LINE_AA)

    if ss > 1:
        mask = cv2.resize(mask_hi, (size, size), interpolation=cv2.INTER_AREA)
    else:
        mask = mask_hi

    return mask.astype(np.float32) / 255.0


def create_circle_mask(size: int, supersample: int = 2) -> np.ndarray:
    ss = max(1, int(supersample))
    hi = size * ss
    mask = np.zeros((hi, hi), dtype=np.uint8)
    cv2.circle(mask, (hi // 2, hi // 2), hi // 2, 255, thickness=-1, lineType=cv2.LINE_AA)
    if ss > 1:
        mask = cv2.resize(mask, (size, size), interpolation=cv2.INTER_AREA)
    return mask.astype(np.float32) / 255.0


def blend_tint(canvas: np.ndarray, mask: np.ndarray, color_bgr: tuple[float, float, float], opacity: float) -> None:
    alpha = np.clip(mask * float(opacity), 0.0, 1.0)
    if not np.any(alpha > 0):
        return
    color = np.array(color_bgr, dtype=np.float32).reshape(1, 1, 3)
    canvas[:] = canvas * (1.0 - alpha[:, :, None]) + color * alpha[:, :, None]


def multiply_tone(canvas: np.ndarray, mask: np.ndarray, factor: float) -> None:
    alpha = np.clip(mask, 0.0, 1.0)
    if not np.any(alpha > 0):
        return
    scale = 1.0 - alpha * (1.0 - float(factor))
    canvas[:] = canvas * scale[:, :, None]


def lerp_vertical(height: int, top_bgr: tuple[float, float, float], bottom_bgr: tuple[float, float, float]) -> np.ndarray:
    y = np.linspace(0.0, 1.0, height, dtype=np.float32)[:, None]
    out = np.zeros((height, 1, 3), dtype=np.float32)
    for i in range(3):
        out[:, 0, i] = top_bgr[i] * (1.0 - y[:, 0]) + bottom_bgr[i] * y[:, 0]
    return out


def make_ellipse_mask(size: int, center: tuple[int, int], axes: tuple[int, int], angle: float, blur_sigma: float) -> np.ndarray:
    layer = np.zeros((size, size), dtype=np.uint8)
    cv2.ellipse(layer, center, axes, angle, 0, 360, 255, thickness=-1, lineType=cv2.LINE_AA)
    if blur_sigma > 0:
        layer = cv2.GaussianBlur(layer, (0, 0), sigmaX=blur_sigma, sigmaY=blur_sigma)
    return layer.astype(np.float32) / 255.0


def render_top_panel(canvas: np.ndarray, y_split: int) -> None:
    size = canvas.shape[0]
    top_h = max(1, y_split)

    grad = lerp_vertical(top_h, top_bgr=(68, 58, 50), bottom_bgr=(26, 23, 20))
    canvas[:top_h, :, :] = grad

    # Dark stainless body tint.
    blend_tint(
        canvas,
        make_ellipse_mask(
            size,
            center=(int(size * 0.62), int(size * 0.28)),
            axes=(int(size * 0.86), int(size * 0.54)),
            angle=2,
            blur_sigma=max(6.0, size * 0.045),
        ) * (np.arange(size)[:, None] < y_split).astype(np.float32),
        color_bgr=(58, 46, 40),
        opacity=0.42,
    )

    # Gentle center lift.
    blend_tint(
        canvas,
        make_ellipse_mask(
            size,
            center=(int(size * 0.46), int(size * 0.33)),
            axes=(int(size * 0.58), int(size * 0.30)),
            angle=-10,
            blur_sigma=max(6.0, size * 0.030),
        ) * (np.arange(size)[:, None] < y_split).astype(np.float32),
        color_bgr=(112, 106, 100),
        opacity=0.12,
    )

    # Subtle bottom vignette for panel depth.
    multiply_tone(
        canvas,
        make_ellipse_mask(
            size,
            center=(int(size * 0.50), int(size * 0.63)),
            axes=(int(size * 0.86), int(size * 0.26)),
            angle=0,
            blur_sigma=max(8.0, size * 0.040),
        ) * (np.arange(size)[:, None] < y_split).astype(np.float32),
        factor=0.72,
    )

    # Refractive dome sheen.
    blend_tint(
        canvas,
        make_ellipse_mask(
            size,
            center=(int(size * 0.23), int(size * 0.16)),
            axes=(int(size * 0.43), int(size * 0.24)),
            angle=-25,
            blur_sigma=max(4.0, size * 0.016),
        ),
        color_bgr=(246, 246, 246),
        opacity=0.58,
    )
    sweep = np.zeros((size, size), dtype=np.uint8)
    cv2.line(
        sweep,
        (int(size * -0.08), int(size * 0.40)),
        (int(size * 1.08), int(size * 0.07)),
        color=255,
        thickness=max(2, int(round(size * 0.065))),
        lineType=cv2.LINE_AA,
    )
    sweep = cv2.GaussianBlur(sweep, (0, 0), sigmaX=max(4.0, size * 0.022), sigmaY=max(4.0, size * 0.022))
    blend_tint(canvas, sweep.astype(np.float32) / 255.0, color_bgr=(232, 233, 236), opacity=0.22)


def render_hazard_band(canvas: np.ndarray, y_split: int) -> None:
    size = canvas.shape[0]
    band_h = size - y_split
    if band_h <= 0:
        return

    y_grid = np.arange(band_h, dtype=np.float32)[:, None]
    x_grid = np.arange(size, dtype=np.float32)[None, :]
    period = max(12, int(round(size * 0.125)))
    stripes = ((x_grid + y_grid * 0.92) // period).astype(np.int32) % 2

    # Smooth stainless separator edge.
    cv2.line(
        canvas,
        (0, y_split),
        (size - 1, y_split),
        color=(178, 186, 195),
        thickness=max(1, int(round(size * 0.0030))),
        lineType=cv2.LINE_AA,
    )
    cv2.line(
        canvas,
        (0, y_split + max(1, int(size * 0.004))),
        (size - 1, y_split + max(1, int(size * 0.004))),
        color=(44, 45, 48),
        thickness=max(1, int(round(size * 0.0020))),
        lineType=cv2.LINE_AA,
    )

    # Prebuild vertical ramps for stripe materials.
    gold_ramp = lerp_vertical(band_h, top_bgr=(58, 236, 255), bottom_bgr=(6, 170, 245)).reshape(band_h, 1, 3)
    dark_ramp = lerp_vertical(band_h, top_bgr=(26, 28, 32), bottom_bgr=(8, 9, 12)).reshape(band_h, 1, 3)

    band = np.zeros((band_h, size, 3), dtype=np.float32)
    band[stripes == 0] = gold_ramp.repeat(size, axis=1)[stripes == 0]
    band[stripes == 1] = dark_ramp.repeat(size, axis=1)[stripes == 1]

    # Gloss pass over the band for liquid-glass clarity.
    gloss = make_ellipse_mask(
        size,
        center=(int(size * 0.72), int(y_split + band_h * 0.36)),
        axes=(int(size * 0.80), int(band_h * 0.92)),
        angle=-16,
        blur_sigma=max(5.0, size * 0.024),
    )[y_split:, :][:, :, None]
    band = band * (1.0 - gloss * 0.24) + np.array([242.0, 246.0, 250.0], dtype=np.float32).reshape(1, 1, 3) * gloss * 0.24

    # Extra clear line near top of stripe band.
    line_y = max(1, int(round(band_h * 0.03)))
    cv2.line(
        band,
        (0, line_y),
        (size - 1, line_y),
        color=(228, 236, 246),
        thickness=max(1, int(round(size * 0.0018))),
        lineType=cv2.LINE_AA,
    )

    canvas[y_split:, :, :] = band


def build_up_text_mask(size: int) -> np.ndarray:
    font = cv2.FONT_HERSHEY_SIMPLEX
    text = "UP"

    desired_width = int(round(size * 0.64))
    desired_height = int(round(size * 0.30))
    base_size, _ = cv2.getTextSize(text, font, 1.0, 1)
    font_scale = min(desired_width / max(1, base_size[0]), desired_height / max(1, base_size[1]))
    thickness = max(2, int(round(size * 0.046)))

    text_size, _ = cv2.getTextSize(text, font, font_scale, thickness)
    x = (size - text_size[0]) // 2
    y = int(round(size * 0.50))

    mask = np.zeros((size, size), dtype=np.uint8)
    cv2.putText(mask, text, (x, y), font, font_scale, 255, thickness=thickness, lineType=cv2.LINE_AA)
    mask = cv2.GaussianBlur(mask, (0, 0), sigmaX=max(0.8, size * 0.0014), sigmaY=max(0.8, size * 0.0014))
    return mask


def render_stainless_up(canvas: np.ndarray, y_split: int) -> None:
    size = canvas.shape[0]
    text_mask_u8 = build_up_text_mask(size)
    text_mask = text_mask_u8.astype(np.float32) / 255.0

    # Keep text strictly on top panel.
    top_region = (np.arange(size)[:, None] < y_split).astype(np.float32)
    text_mask *= top_region
    text_mask_u8 = np.clip(text_mask * 255.0, 0, 255).astype(np.uint8)

    # Soft depth shadow.
    shadow = cv2.GaussianBlur(text_mask_u8, (0, 0), sigmaX=max(2.0, size * 0.010), sigmaY=max(2.0, size * 0.010))
    shift = int(round(size * 0.006))
    shadow = cv2.warpAffine(
        shadow.astype(np.float32) / 255.0,
        np.float32([[1, 0, shift], [0, 1, shift]]),
        (size, size),
        flags=cv2.INTER_LINEAR,
        borderMode=cv2.BORDER_CONSTANT,
        borderValue=0,
    )
    multiply_tone(canvas, shadow, factor=0.50)

    # Dark halo stroke around letters for contrast.
    k_outer = max(3, int(round(size * 0.008)))
    kernel_outer = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (k_outer, k_outer))
    dilated = cv2.dilate(text_mask_u8, kernel_outer)
    outer = np.clip((dilated.astype(np.float32) - text_mask_u8.astype(np.float32)) / 255.0, 0.0, 1.0)
    blend_tint(canvas, outer * top_region, color_bgr=(26, 26, 30), opacity=0.52)

    # Stainless fill (smooth, no texture) with stronger separation.
    ys, _ = np.where(text_mask_u8 > 0)
    if ys.size == 0:
        return
    y0 = int(ys.min())
    y1 = int(ys.max())
    span = max(1, y1 - y0)
    y_local = (np.arange(size, dtype=np.float32).reshape(size, 1, 1) - float(y0)) / float(span)
    y_local = np.clip(y_local, 0.0, 1.0)

    top = np.array([254.0, 254.0, 254.0], dtype=np.float32).reshape(1, 1, 3)
    mid_hi = np.array([230.0, 233.0, 238.0], dtype=np.float32).reshape(1, 1, 3)
    mid_lo = np.array([178.0, 186.0, 196.0], dtype=np.float32).reshape(1, 1, 3)
    low = np.array([126.0, 136.0, 148.0], dtype=np.float32).reshape(1, 1, 3)

    grad = np.where(
        y_local < 0.24,
        top * (1.0 - y_local / 0.24) + mid_hi * (y_local / 0.24),
        np.where(
            y_local < 0.64,
            mid_hi * (1.0 - (y_local - 0.24) / 0.40) + mid_lo * ((y_local - 0.24) / 0.40),
            mid_lo * (1.0 - (y_local - 0.64) / 0.36) + low * ((y_local - 0.64) / 0.36),
        ),
    )
    canvas[:] = canvas * (1.0 - text_mask[:, :, None]) + grad * text_mask[:, :, None]

    # Bevel maps.
    k = max(3, int(round(size * 0.006)))
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (k, k))
    inner = cv2.erode(text_mask_u8, kernel)
    rim = np.clip((text_mask_u8.astype(np.float32) - inner.astype(np.float32)) / 255.0, 0.0, 1.0)
    inner_mask = np.clip(inner.astype(np.float32) / 255.0, 0.0, 1.0)

    x = np.linspace(-1.0, 1.0, size, dtype=np.float32).reshape(1, size)
    yy = np.linspace(-1.0, 1.0, size, dtype=np.float32).reshape(size, 1)
    bevel_bright = np.clip(0.92 - 0.65 * x - 0.95 * yy, 0.0, 1.0)
    bevel_dark = np.clip(0.20 + 0.80 * x + 1.00 * yy, 0.0, 1.0)

    blend_tint(canvas, inner_mask * bevel_bright, color_bgr=(255, 255, 255), opacity=0.18)
    multiply_tone(canvas, inner_mask * bevel_dark, factor=0.84)

    # Bevel rim.
    blend_tint(canvas, rim, color_bgr=(255, 255, 255), opacity=0.55)

    # Edge shadow on lower-right.
    rim_shadow = cv2.GaussianBlur(rim.astype(np.float32), (0, 0), sigmaX=max(1.2, size * 0.0035), sigmaY=max(1.2, size * 0.0035))
    rim_shadow = cv2.warpAffine(
        rim_shadow,
        np.float32([[1, 0, int(round(size * 0.002))], [0, 1, int(round(size * 0.002))]]),
        (size, size),
        flags=cv2.INTER_LINEAR,
        borderMode=cv2.BORDER_CONSTANT,
        borderValue=0,
    )
    multiply_tone(canvas, rim_shadow * text_mask, factor=0.72)

    # Vertical steel reflection lane.
    lane = make_ellipse_mask(
        size,
        center=(int(size * 0.34), int(size * 0.30)),
        axes=(int(size * 0.10), int(size * 0.26)),
        angle=-5,
        blur_sigma=max(2.0, size * 0.010),
    )
    blend_tint(canvas, lane * text_mask, color_bgr=(255, 255, 255), opacity=0.22)

    # Specular streak across letters.
    spec = make_ellipse_mask(
        size,
        center=(int(size * 0.43), int(size * 0.21)),
        axes=(int(size * 0.40), int(size * 0.13)),
        angle=-15,
        blur_sigma=max(3.0, size * 0.015),
    )
    blend_tint(canvas, spec * text_mask, color_bgr=(255, 255, 255), opacity=0.50)


def render_clearcoat(canvas: np.ndarray) -> None:
    size = canvas.shape[0]

    # Primary top-left pooled reflection.
    blend_tint(
        canvas,
        make_ellipse_mask(
            size,
            center=(int(size * 0.14), int(size * 0.14)),
            axes=(int(size * 0.35), int(size * 0.24)),
            angle=-28,
            blur_sigma=max(5.0, size * 0.022),
        ),
        color_bgr=(255, 255, 255),
        opacity=0.42,
    )

    # Secondary curved reflection.
    curved = make_ellipse_mask(
        size,
        center=(int(size * 0.90), int(size * 0.12)),
        axes=(int(size * 0.42), int(size * 0.18)),
        angle=-14,
        blur_sigma=max(4.0, size * 0.020),
    )
    blend_tint(canvas, curved, color_bgr=(246, 248, 252), opacity=0.18)

    # Bottom glass lip.
    lip = make_ellipse_mask(
        size,
        center=(int(size * 0.52), int(size * 0.96)),
        axes=(int(size * 0.54), int(size * 0.08)),
        angle=0,
        blur_sigma=max(3.0, size * 0.012),
    )
    blend_tint(canvas, lip, color_bgr=(228, 235, 242), opacity=0.24)


def apply_body_rim(canvas: np.ndarray, body_mask: np.ndarray) -> None:
    size = canvas.shape[0]
    rim_width = max(2, int(round(size * 0.012)))

    inner = create_superellipse_mask(size=size, exponent=5.3, inset=rim_width, supersample=1)
    rim = np.clip(body_mask - inner, 0.0, 1.0)

    x = np.linspace(-1.0, 1.0, size, dtype=np.float32).reshape(1, size)
    y = np.linspace(-1.0, 1.0, size, dtype=np.float32).reshape(size, 1)
    bright = np.clip(0.90 - 0.62 * x - 0.84 * y, 0.0, 1.0)
    dark = np.clip(0.12 + 0.76 * x + 0.88 * y, 0.0, 1.0)

    blend_tint(canvas, rim * bright, color_bgr=(248, 248, 248), opacity=0.88)
    multiply_tone(canvas, rim * dark, factor=0.42)

    inner2 = create_superellipse_mask(size=size, exponent=5.3, inset=rim_width * 2, supersample=1)
    ring = np.clip(inner - inner2, 0.0, 1.0)
    multiply_tone(canvas, ring, factor=0.86)


def compose_master_square(render_size: int) -> np.ndarray:
    body_mask = create_superellipse_mask(size=render_size, exponent=5.3, inset=0, supersample=2)
    canvas = np.zeros((render_size, render_size, 3), dtype=np.float32)

    y_split = int(round(render_size * 0.605))
    render_top_panel(canvas, y_split)
    render_hazard_band(canvas, y_split)
    render_stainless_up(canvas, y_split)
    render_clearcoat(canvas)
    apply_body_rim(canvas, body_mask)

    canvas *= body_mask[:, :, None]

    alpha = np.clip(body_mask * 255.0, 0, 255).astype(np.uint8)
    rgba = np.dstack([np.clip(canvas, 0, 255).astype(np.uint8), alpha])
    return rgba


def upscale_if_needed(image: np.ndarray, target: int) -> np.ndarray:
    if image.shape[0] == target and image.shape[1] == target:
        return image

    up = cv2.resize(image, (target, target), interpolation=cv2.INTER_LANCZOS4)
    rgb = up[:, :, :3].astype(np.float32)
    blur = cv2.GaussianBlur(rgb, (0, 0), sigmaX=0.8, sigmaY=0.8)
    sharp = np.clip(cv2.addWeighted(rgb, 1.10, blur, -0.10, 0), 0, 255).astype(np.uint8)
    return np.dstack([sharp, up[:, :, 3]])


def make_round_variant(square_rgba: np.ndarray) -> np.ndarray:
    size = square_rgba.shape[0]
    circle = create_circle_mask(size=size, supersample=2)
    out = square_rgba.copy()
    out[:, :, 3] = np.clip(circle * 255.0, 0, 255).astype(np.uint8)
    out[:, :, :3] = (out[:, :, :3].astype(np.float32) * circle[:, :, None]).astype(np.uint8)
    return out


def main() -> None:
    args = parse_args()
    output_dir = Path(args.output_dir).resolve()
    target = int(args.target)
    base_render = int(args.base_render)

    if target < 512:
        fail("Target size must be at least 512.")
    if base_render < 512:
        fail("Base render size must be at least 512.")

    render_size = min(target, base_render)
    master_square = compose_master_square(render_size)
    master_square = upscale_if_needed(master_square, target)

    all_sizes = sorted(set(DEFAULT_SIZES + [target]))
    square_pngs_for_ico: list[Path] = []
    round_pngs_for_ico: list[Path] = []

    for size in all_sizes:
        square_icon = resized(master_square, size)
        square_path = output_dir / f"underpar-{size}.png"
        write_png(square_path, square_icon)
        if size in ICO_SIZES:
            square_pngs_for_ico.append(square_path)

    # 1024 preview source for review pipelines.
    write_png(output_dir / "underpar-concept-source.png", resized(master_square, 1024))
    make_ico(output_dir / "underpar.ico", square_pngs_for_ico)

    if args.include_round:
        master_round = make_round_variant(master_square)
        for size in all_sizes:
            round_icon = resized(master_round, size)
            round_path = output_dir / f"underpar-round-{size}.png"
            write_png(round_path, round_icon)
            if size in ICO_SIZES:
                round_pngs_for_ico.append(round_path)
        make_ico(output_dir / "underpar-round.ico", round_pngs_for_ico)

    print("[generate_icon_set] style: smooth stainless + high-gloss liquid glass")
    print("[generate_icon_set] generated square sizes:", ", ".join(str(size) for size in all_sizes))
    print(f"[generate_icon_set] round variants: {'enabled' if args.include_round else 'disabled'}")
    print(f"[generate_icon_set] output dir: {output_dir}")


if __name__ == "__main__":
    main()
