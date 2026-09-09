<?php
// scripts/convert_to_webp.php
// Convierte o copia imágenes locales (JPG/PNG) a .webp y las guarda en el directorio del portfolio.

$destDir = __DIR__ . '/../public/img/projects';
if (!is_dir($destDir)) {
    mkdir($destDir, 0755, true);
}

$images = [
    'C:/Users/y_garridopar/Downloads/fto.jpg',
    'C:/Users/y_garridopar/Pictures/Screenshots/archive_mobile1.png',
    'C:/Users/y_garridopar/Pictures/Screenshots/archive_mobile2.png',
    'C:/Users/y_garridopar/Pictures/Screenshots/archive_mobile3.png',
    'C:/Users/y_garridopar/Pictures/Screenshots/archive1.png',
    'C:/Users/y_garridopar/Pictures/Screenshots/archive2.png',
    'C:/Users/y_garridopar/Pictures/Screenshots/archive3.png',
    'C:/Users/y_garridopar/Pictures/Screenshots/archive4.png',
    'C:/Users/y_garridopar/Pictures/Screenshots/archive5.png',
];

$canConvert = function_exists('imagewebp');

foreach ($images as $src) {
    if (!is_file($src)) {
        echo "⚠️ No se encontró: $src\n";
        continue;
    }
    $info = pathinfo($src);
    $dest = $destDir . '/' . $info['filename'] . '.webp';

    if ($canConvert) {
        $ext = strtolower($info['extension'] ?? '');
        switch ($ext) {
            case 'jpg':
            case 'jpeg':
                $img = @imagecreatefromjpeg($src);
                break;
            case 'png':
                $img = @imagecreatefrompng($src);
                break;
            default:
                echo "🚫 Formato no soportado $ext para $src, se copia sin conversión.\n";
                $img = false;
        }
        if ($img && imagewebp($img, $dest, 80)) {
            echo "✅ Convertido $src → $dest\n";
        } else {
            // Si falla la conversión, copiar tal cual
            echo "⚠️ Conversión falló o no soportada, copiando $src como $dest\n";
            copy($src, $dest);
        }
        if ($img) {
            imagedestroy($img);
        }
    } else {
        // Sin soporte GD WebP, simplemente copiar con extensión .webp
        if (copy($src, $dest)) {
            echo "✅ Copiado $src → $dest (sin conversión)\n";
        } else {
            echo "❌ Error al copiar $src\n";
        }
    }
}
?>

