"""Fetch title, date, views and a short description for every video on the site.
Writes src/data/videos.json. Run: python3 scripts/fetch_videos.py"""
import json, re, glob, urllib.request, html
ids = []
for f in glob.glob('src/content/*/*.md'):
    m = re.search(r'^videoIds:\s*(\[.*\])', open(f).read(), re.M)
    if m: ids += [i for i in json.loads(m.group(1)) if i not in ids]
try: old = json.load(open('src/data/videos.json'))
except Exception: old = {}
def short(d):
    d = re.sub(r'https?://\S+|#\w+|@\w+', '', d)
    keep = []
    for line in d.splitlines():
        line = line.strip(' -•|:')
        if not line or re.search(r'(?i)subscribe|follow us|contact us|call us|visit|website|instagram|facebook|tiktok|chapters|timestamps|^\d+:\d+|email|phone|\(\d{3}\)|\d{3}-\d{3}-\d{4}|learn more', line): continue
        keep.append(line)
        if len(' '.join(keep)) > 160: break
    s = ' '.join(keep)
    if len(s) > 220:
        s = s[:220].rsplit(' ', 1)[0].rstrip(',;:') + '…'
    return s
out = {}
for i in ids:
    if i in old and old[i].get('desc') is not None: out[i] = old[i]; continue
    req = urllib.request.Request(f'https://www.youtube.com/watch?v={i}', headers={'User-Agent': 'Mozilla/5.0', 'Accept-Language': 'en-US'})
    try: t = urllib.request.urlopen(req, timeout=20).read().decode('utf8', 'ignore')
    except Exception as e: print('fail', i, e); continue
    g = lambda p: (re.search(p, t) or [None, None])[1]
    title = g(r'"title":"((?:[^"\\]|\\.)*)","lengthSeconds"') or g(r'<meta name="title" content="([^"]*)"')
    desc = g(r'"shortDescription":"((?:[^"\\]|\\.)*)"') or ''
    date = (g(r'"uploadDate":"(\d{4}-\d\d-\d\d)') or g(r'"publishDate":"(\d{4}-\d\d-\d\d)'))
    views = g(r'"viewCount":"(\d+)"')
    dec = lambda s: json.loads('"' + s + '"') if s else s
    out[i] = {'title': html.unescape(dec(title) or ''), 'desc': short(dec(desc)), 'date': date, 'views': int(views) if views else None}
    print(i, date, out[i]['title'][:50], '|', out[i]['desc'][:70])
json.dump(out, open('src/data/videos.json', 'w'), indent=1, ensure_ascii=False)
print(len(out), 'of', len(ids))
