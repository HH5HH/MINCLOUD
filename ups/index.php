<?php

declare(strict_types=1);

require __DIR__ . '/lib.php';

underpar_ibeta_send_cors_headers();

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && (string) ($_GET['mode'] ?? '') === 'store') {
    header('Content-Type: application/json; charset=utf-8');

    $decoded = json_decode(underpar_ibeta_read_request_body(), true);
    $snapshot = underpar_ibeta_normalize_snapshot($decoded['snapshot'] ?? null);
    if ($snapshot === null) {
        http_response_code(400);
        echo json_encode(['ok' => false], JSON_UNESCAPED_SLASHES);
        exit;
    }

    $stored = underpar_ibeta_store_snapshot($snapshot, [
        'source' => underpar_ibeta_normalize_text($decoded['source'] ?? ''),
        'debug' => is_array($decoded['debug'] ?? null) ? $decoded['debug'] : [],
    ]);
    if ($stored === null) {
        http_response_code(500);
        echo json_encode(['ok' => false], JSON_UNESCAPED_SLASHES);
        exit;
    }

    echo json_encode([
        'ok' => true,
        'id' => $stored['id'],
        'viewUrl' => $stored['viewUrl'],
    ], JSON_UNESCAPED_SLASHES);
    exit;
}

$id = underpar_ibeta_normalize_text($_GET['id'] ?? '');
$record = $id !== '' ? underpar_ibeta_load_record($id) : null;
$debugMeta = underpar_ibeta_debug_meta($record ?? [], $id);
$snapshot = is_array($record['snapshot'] ?? null) ? $record['snapshot'] : null;

if ($id === '') {
    underpar_ibeta_render_minimal_landing();
}

if ($snapshot === null) {
    http_response_code(404);
    underpar_ibeta_render_minimal_landing();
}

$snapshotJson = $snapshot ? json_encode($snapshot, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) : '{}';
$debugComment = underpar_ibeta_html_comment($debugMeta);
?>
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>UPSpace</title>
    <link rel="stylesheet" href="./esm-workspace.css" />
    <link rel="stylesheet" href="./view.css" />
  </head>
  <body>
    <main id="ibeta-root" class="workspace-app ibeta-app" aria-live="polite"></main>
    <script id="underpar-ibeta-snapshot" type="application/json"><?= htmlspecialchars((string) $snapshotJson, ENT_NOQUOTES, 'UTF-8') ?></script>
    <script>
      window.__UNDERPAR_IBETA_DEBUG__ = <?= json_encode($debugMeta, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) ?>;
    </script>
    <script src="./view.js"></script>
<?= $debugComment . PHP_EOL ?>
  </body>
</html>
