<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep downloaded game media in CDN asset pointers and compose the table in the index route with a dedicated original header component using source-derived order and dimensions, so original artwork stays separate from presentation.
- Load live decor dialog images from the source's DPR-selected dialog bundles and table animations from its size-selected table bundles; store thumbnails are not available in table bundles.
- Keep the decor presenter, source-derived dialog, and browser-only Pixi/Spine table renderer separate so server rendering never imports browser graphics code.
