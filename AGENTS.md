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
- Gift sending ports GiftAnimations/Gift/SendGiftDialog from the source: gift data, images, spines and sounds load live from the game servers, and gift views are fully loaded before the flight starts so animations never hitch.
- Preserve intrinsic gift image sizing inside an outer animation container; geometry and combo thresholds live in browser-safe modules, while original particle configs stay in the browser-only effect renderer. This prevents flight scaling from overriding server image dimensions and keeps rendering out of SSR.
- Chat music/video ports MusicListDialog, MusicPreviewDialog, MusicViewPreact and the Ciliz music/YouTube services; catalogues and playback load live from the game servers, and the shared playing-song state lives in a browser-safe store so the chat line, media panel and player stay in sync.
