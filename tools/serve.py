"""Servidor local para testar o Mundo do Aprender.

Igual a `python -m http.server`, mas manda o navegador sempre buscar a versão
nova dos arquivos (sem cache). Assim, uma mudança no código aparece ao
recarregar a página, sem precisar limpar o cache.

Uso, na pasta do projeto:  python tools/serve.py   (porta 8123)
                           python tools/serve.py 9000
Depois abra http://localhost:8123
"""
import sys
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


class NoCacheHandler(SimpleHTTPRequestHandler):
    extensions_map = {**SimpleHTTPRequestHandler.extensions_map, '.js': 'text/javascript', '.svg': 'image/svg+xml'}

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()


def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8123
    server = ThreadingHTTPServer(('127.0.0.1', port), partial(NoCacheHandler, directory=str(ROOT)))
    print(f'Mundo do Aprender em http://localhost:{port}  (Ctrl+C para parar)')
    server.serve_forever()


if __name__ == '__main__':
    main()
