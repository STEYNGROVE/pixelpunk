from html.parser import HTMLParser
from pathlib import Path
from re import findall
from urllib.parse import unquote, urljoin, urlsplit

DIST = Path("dist")
BASE = "https://steyngrove.github.io/pixelpunk/"
assert {path.name for path in DIST.iterdir()} == {"index.html", "style.css", "app.js", "pixelpunk-share.jpg"}


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = set()
        self.urls = []

    def handle_starttag(self, tag, attrs):
        for key, value in attrs:
            if key == "id":
                assert value not in self.ids, f"Duplicate ID {value}"
                self.ids.add(value)
            if key in {"href", "src"} and value:
                self.urls.append(value)


page = Page()
page.feed((DIST / "index.html").read_text(encoding="utf-8"))
css_urls = findall(r"""url\(\s*['"]?([^'"\s)]+)""", (DIST / "style.css").read_text())
origin = urlsplit(BASE).netloc
for url in page.urls + css_urls:
    resolved = urlsplit(urljoin(BASE, url))
    if resolved.netloc != origin:
        assert resolved.scheme == "https", f"Unexpected external URL {url}"
        continue
    assert resolved.path.startswith("/pixelpunk/"), f"URL outside Pages path: {url}"
    path = unquote(resolved.path.removeprefix("/pixelpunk/")) or "index.html"
    assert (DIST / path).is_file(), f"Missing file for {url}"
    if resolved.fragment:
        assert path == "index.html" and unquote(resolved.fragment) in page.ids, f"Missing anchor {url}"
print("Pages paths, assets, anchors and artifact contents passed")
