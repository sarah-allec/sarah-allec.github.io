# sarah-allec.github.io

Source for [sarah-allec.github.io](https://sarah-allec.github.io/), a single-page personal site built with
[Jekyll](https://jekyllrb.com/) and hosted on GitHub Pages. Pushing to `master` publishes the site
automatically; nothing needs to be built by hand.

## Updating content

Almost everything on the page comes from plain-text files in `_data/`:

| File | What it controls |
| --- | --- |
| `_data/profile.yml` | Name, role, About paragraphs, research interests, and the link buttons |
| `_data/themes.yml` | The four research theme cards (title, icon, one paragraph) |
| `_data/experience.yml` | Positions held |
| `_data/education.yml` | Degrees |
| `_data/publications.yml` | Publication list (grouped by year automatically) |
| `_data/talks.yml`, `_data/awards.yml`, `_data/service.yml` | The "Talks, awards & service" section |

To add a publication, copy an existing block in `_data/publications.yml` and fill in the fields.
Only `title`, `authors`, `journal`, `year`, and `doi` are required. Your name is bolded automatically
when written as `S. I. Allec` or `S. Allec`. Add `featured: true` to a publication to show it as a
card in the "Selected" row above the full list.

The CV and resume PDFs live in `img/` so that existing links to them keep working. Replace the files
to update them.

The site is dark by default, with a sun/moon toggle in the nav for light mode. Both palettes are set
at the top of `assets/css/style.css`, along with the fonts. Section templates are in `_includes/`.

## Previewing locally

Requires a current Ruby (installed via Homebrew: `brew install ruby@3.3`).

```sh
export PATH="/opt/homebrew/opt/ruby@3.3/bin:$PATH"
bundle install          # first time only
bundle exec jekyll serve
```

Then open <http://localhost:4000/>. The page reloads as files change.
