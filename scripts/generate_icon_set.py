#!/usr/bin/env python3

"""
Generate the UnderPAR icon set from a single source image.

Outputs:
- Square PNG icons at multiple sizes (including 4096 master)
- Circular-masked PNG variants at multiple sizes
- Multi-size ICO files for square and round sets
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


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Generate UnderPAR icon set from a single source image.")
    parser.add_argument(
        "--input",
        default="icons/underpar-512.png",
        help="Path to source image. Default: icons/underpar-512.png",
    )
    parser.add_argument(
        "--output-dir",
        default="icons",
        help="Output directory. Default: icons",
    )
    parser.add_argument(
        "--target",
        type=int,
        default=4096,
        help="Master target size in px. Default: 4096",
    )
    return parser.parse_args()


def fail(message: str) -> None:
    print(f"[generate_icon_set] {message}", file=sys.stderr)
    sys.exit(1)


def ensure_bgra(image: np.ndarray) -> np.ndarray:
    if image.ndim != 3:
        fail("Unsupported image format.")
    if image.shape[2] == 4:
        return image
    if image.shape[2] == 3:
        alpha = np.full((image.shape[0], image.shape[1], 1), 255, dtype=np.uint8)
        return np.concatenate([image, alpha], axis=2)
    fail("Unsupported channel count.")
    return image


def center_square(image: np.ndarray) -> np.ndarray:
    height, width = image.shape[:2]
    if height == width:
        return image
    size = min(height, width)
    top = (height - size) // 2
    left = (width - size) // 2
    return image[top : top + size, left : left + size]


def upscale_and_enhance(image: np.ndarray, target: int) -> np.ndarray:
    bgr = image[:, :, :3]
    alpha = image[:, :, 3]

    up_bgr = cv2.resize(bgr, (target, target), interpolation=cv2.INTER_LANCZOS4)
    up_alpha = cv2.resize(alpha, (target, target), interpolation=cv2.INTER_LANCZOS4)

    # Mild local contrast enhancement to keep depth while preserving realism.
    lab = cv2.cvtColor(up_bgr, cv2.COLOR_BGR2LAB)
    l_channel, a_channel, b_channel = cv2.split(lab)
    clahe = cv2.createCLAHE(clipLimit=1.7, tileGridSize=(8, 8))
    l_channel = clahe.apply(l_channel)
    up_bgr = cv2.cvtColor(cv2.merge([l_channel, a_channel, b_channel]), cv2.COLOR_LAB2BGR)

    # Subtle unsharp mask for edge crispness at high DPI.
    blur = cv2.GaussianBlur(up_bgr, (0, 0), sigmaX=1.1, sigmaY=1.1)
    up_bgr = cv2.addWeighted(up_bgr, 1.14, blur, -0.14, 0)

    return np.dstack([up_bgr, up_alpha]).astype(np.uint8)


def make_round_variant(image: np.ndarray) -> np.ndarray:
    output = image.copy()
    height, width = output.shape[:2]
    radius = min(height, width) // 2
    center = (width // 2, height // 2)

    mask = np.zeros((height, width), dtype=np.uint8)
    cv2.circle(mask, center, radius, 255, thickness=-1, lineType=cv2.LINE_AA)
    output[:, :, 3] = (output[:, :, 3].astype(np.uint16) * mask.astype(np.uint16) // 255).astype(np.uint8)
    return output


def write_png(path: Path, image: np.ndarray) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    ok = cv2.imwrite(str(path), image, [cv2.IMWRITE_PNG_COMPRESSION, 9])
    if not ok:
        fail(f"Failed to write {path}")


def resized(image: np.ndarray, size: int) -> np.ndarray:
    if image.shape[0] == size and image.shape[1] == size:
        return image
    return cv2.resize(image, (size, size), interpolation=cv2.INTER_AREA)


def make_ico(output_path: Path, png_paths: list[Path]) -> None:
    if not png_paths:
        return

    cmd = ["ffmpeg", "-y"]
    for icon_path in png_paths:
        cmd.extend(["-i", str(icon_path)])
    for index in range(len(png_paths)):
        cmd.extend(["-map", str(index)])
    cmd.append(str(output_path))

    try:
        subprocess.run(cmd, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    except FileNotFoundError:
        fail("ffmpeg is required to generate .ico files.")
    except subprocess.CalledProcessError as error:
        message = error.stderr.decode("utf-8", errors="replace").strip()
        fail(f"Failed to generate ICO file ({output_path}): {message}")


def main() -> None:
    args = parse_args()
    input_path = Path(args.input).resolve()
    output_dir = Path(args.output_dir).resolve()
    target = int(args.target)

    if target < 512:
        fail("Target size must be at least 512.")
    if not input_path.exists():
        fail(f"Input image not found: {input_path}")

    source = cv2.imread(str(input_path), cv2.IMREAD_UNCHANGED)
    if source is None:
        fail(f"Unable to read image: {input_path}")

    source = ensure_bgra(center_square(source))
    master = upscale_and_enhance(source, target)
    master_round = make_round_variant(master)

    all_sizes = sorted(set(DEFAULT_SIZES + [target]))
    square_pngs_for_ico: list[Path] = []
    round_pngs_for_ico: list[Path] = []

    for size in all_sizes:
        square_icon = resized(master, size)
        round_icon = resized(master_round, size)

        square_path = output_dir / f"underpar-{size}.png"
        round_path = output_dir / f"underpar-round-{size}.png"

        write_png(square_path, square_icon)
        write_png(round_path, round_icon)

        if size in ICO_SIZES:
            square_pngs_for_ico.append(square_path)
            round_pngs_for_ico.append(round_path)

    make_ico(output_dir / "underpar.ico", square_pngs_for_ico)
    make_ico(output_dir / "underpar-round.ico", round_pngs_for_ico)

    print(
        "[generate_icon_set] generated sizes:",
        ", ".join(str(size) for size in all_sizes),
    )
    print(f"[generate_icon_set] output dir: {output_dir}")


if __name__ == "__main__":
    main()
