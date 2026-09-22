from http.server import SimpleHTTPRequestHandler, HTTPServer
from pathlib import Path
import os


class RangeRequestHandler(SimpleHTTPRequestHandler):

    def send_head(self):

        path = Path(self.translate_path(self.path))

        # ------------------------------------------------------
        # Si l'URL correspond à un dossier
        # ------------------------------------------------------
        if path.is_dir():

            index = path / "index.html"

            if index.exists():
                path = index
            else:
                self.send_error(404, "File not found")
                return None

        # ------------------------------------------------------
        # Fichier inexistant
        # ------------------------------------------------------
        if not path.is_file():
            self.send_error(404, "File not found")
            return None

        file_size = path.stat().st_size

        range_header = self.headers.get("Range")

        # ------------------------------------------------------
        # Requête normale
        # ------------------------------------------------------
        if not range_header:

            self.send_response(200)
            self.send_header(
                "Content-Type",
                self.guess_type(str(path))
            )
            self.send_header(
                "Content-Length",
                str(file_size)
            )
            self.send_header(
                "Accept-Ranges",
                "bytes"
            )
            self.end_headers()

            return open(path, "rb")

        # ------------------------------------------------------
        # Requête HTTP Range
        # ------------------------------------------------------
        try:

            range_value = range_header.replace("bytes=", "")

            start, end = range_value.split("-")

            start = int(start)

            if end:
                end = int(end)
            else:
                end = file_size - 1

            end = min(end, file_size - 1)

            if start >= file_size:

                self.send_error(
                    416,
                    "Requested Range Not Satisfiable"
                )

                return None

            length = end - start + 1

            self.send_response(206)

            self.send_header(
                "Content-Type",
                self.guess_type(str(path))
            )

            self.send_header(
                "Content-Length",
                str(length)
            )

            self.send_header(
                "Content-Range",
                f"bytes {start}-{end}/{file_size}"
            )

            self.send_header(
                "Accept-Ranges",
                "bytes"
            )

            self.end_headers()

            file = open(path, "rb")

            file.seek(start)

            return RangeFile(file, length)

        except Exception as e:

            self.send_error(
                400,
                str(e)
            )

            return None


class RangeFile:

    def __init__(self, file, remaining):

        self.file = file
        self.remaining = remaining

    def read(self, size=-1):

        if self.remaining <= 0:
            return b""

        if size < 0 or size > self.remaining:
            size = self.remaining

        data = self.file.read(size)

        self.remaining -= len(data)

        return data

    def close(self):

        self.file.close()


# ==========================================================
# DOSSIER DU SITE QUARTO
# ==========================================================

site = Path(__file__).parent / "_site"

if not site.exists():

    print()
    print("ERREUR : le dossier _site n'existe pas :")
    print(site)
    print()

    input("Appuyez sur Entrée...")
    exit()


os.chdir(site)

print()
print("==========================================")
print(" SERVEUR PMTILES")
print("==========================================")
print()
print(f"Serveur lancé depuis : {site}")
print("http://localhost:8000")
print()

server = HTTPServer(
    ("localhost", 8000),
    RangeRequestHandler
)

server.serve_forever()