#!/usr/bin/env bash
# Gera assets/js/manifest.js com a lista de fotos e vídeos por categoria.
set -euo pipefail

cd "$(dirname "$0")/.."

OUT="assets/js/manifest.js"
mkdir -p "$(dirname "$OUT")"

IMG_EXT="jpg jpeg png webp"
VID_EXT="mp4 mov webm"

is_image() {
  case "${1,,}" in
    *.jpg|*.jpeg|*.png|*.webp) return 0 ;;
    *) return 1 ;;
  esac
}
is_video() {
  case "${1,,}" in
    *.mp4|*.mov|*.webm) return 0 ;;
    *) return 1 ;;
  esac
}

declare -A CATEGORIES=(
  ["dra-vanessa"]="Dr Vanessa|Dra. Vanessa"
  ["sobre"]="Sobre|Sobre"
  ["equipe"]="Equipe|Equipe"
  ["resultados"]="Resultados|Resultados"
  ["lentes"]="Lentes|Lentes de Contato"
  ["clareamento"]="clareamento|Clareamento"
  ["kids"]="Kids|Odontopediatria (Kids)"
  ["bruxismo"]="Bruxismo|Bruxismo"
  ["aparelho-ortopedico"]="Aparelho ortopédicos|Aparelho Ortopédico"
  ["mordida-aberta"]="Mordida aberta|Mordida Aberta"
  ["chupeta"]="Cuidado com a chupeta|Cuidado com a Chupeta"
  ["boca-aberta"]="Seu filho dorme de boca aberta Atenção|Dorme de Boca Aberta?"
)

CATEGORY_ORDER=(dra-vanessa resultados lentes clareamento kids aparelho-ortopedico bruxismo mordida-aberta chupeta boca-aberta equipe sobre)

{
  echo "// Arquivo gerado automaticamente por scripts/build-manifest.sh — não edite manualmente."
  echo "window.MEDIA_MANIFEST = {"
  echo "  photos: ["
  for key in "${CATEGORY_ORDER[@]}"; do
    IFS='|' read -r folder label <<< "${CATEGORIES[$key]}"
    echo "    {"
    echo "      id: \"$key\","
    echo "      label: \"$label\","
    echo "      folder: \"$folder\","
    echo "      items: ["
    if [ -d "$folder" ]; then
      find "$folder" -maxdepth 1 -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.webp" \) -printf "%s %p\n" \
        | sort -k2 \
        | while read -r size path; do
          [ "$size" -lt 1000 ] && continue
          rel="${path#./}"
          echo "        \"$rel\","
        done
    fi
    echo "      ]"
    echo "    },"
  done
  echo "  ],"
  echo "  videos: ["
  for dir in Videos Kids/Videos; do
    if [ -d "$dir" ]; then
      find "$dir" -maxdepth 1 -type f \( -iname "*.mp4" -o -iname "*.mov" -o -iname "*.webm" \) -printf "%s %p\n" \
        | sort -k2 \
        | while read -r size path; do
          [ "$size" -lt 10000 ] && continue
          rel="${path#./}"
          echo "    \"$rel\","
        done
    fi
  done
  echo "  ]"
  echo "};"
} > "$OUT"

echo "Manifesto gerado em $OUT"
