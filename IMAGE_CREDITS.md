# Image and video sources

## Client's own material
- `public/brand/*`: made from `Logo_Ecosphere-Solutions.pdf` by `scripts/generate-brand-assets.mjs`.
- `public/images/field/*` and `public/videos/*`: chosen from the client's "VIDEO & PICS" folder by
  `scripts/prepare-media.mjs`. Photos were resized and stripped of metadata (including GPS). Video
  clips were trimmed to short sections and exported without sound.

## Earth maps (home page hero)
`public/images/earth/*`: NASA Blue Marble (day), Earth at Night (city lights) and cloud maps.
NASA imagery is in the public domain. Files were taken from the examples of the open-source
`three-globe` package (jsDelivr CDN) and resized.

## Stock photographs
`public/images/stock/*`: free photographs from Unsplash, used under the Unsplash License
(free for commercial use, no attribution required). Listed here for the record.

| File | Unsplash photo page | Photographer (Unsplash user) |
| --- | --- | --- |
| sunrise-mist.jpg | https://unsplash.com/photos/u5j63i9YVUw | @ato_aikins |
| river-aerial.jpg | https://unsplash.com/photos/Mw6MYQaB0L4 | @ato_aikins |
| misty-canopy.jpg | https://unsplash.com/photos/RhjVGxILcqE | @tobiastu |
| crater-green.jpg | https://unsplash.com/photos/BlQTC_JzRLY | @matthewryanstephenson |
| cloud-forest.jpg | https://unsplash.com/photos/HU_iSmQqpK4 | @evstki |
| rainforest-mist.jpg | https://unsplash.com/photos/xFqH9peAlmw | @davidclode |
| green-hills.jpg | https://unsplash.com/photos/oQq2KYU_SAs | @evans_dimsphoto |
| kilimanjaro.jpg | https://unsplash.com/photos/mfX814jtyro | @sickle |
| river-forest.jpg | https://unsplash.com/photos/vkQgb1lZZPQ | @ivoprod |
| forest-canopy.jpg | https://unsplash.com/photos/fqooKAlynf0 | @andrikyrychok_art |
| mangrove-aerial.jpg | https://unsplash.com/photos/jSgCHNQqEQ4 | @nazyhu___ |
| planting-seedling.jpg | https://unsplash.com/photos/EkEdHarUPTs | @vitormonthay |
| hands-soil.jpg | https://unsplash.com/photos/bYZn_C-RswQ | @greenforce_staffing |
| open-pit-mine.jpg | https://unsplash.com/photos/hv2aH0nQFPo | @aedrian |
| offshore-platform.jpg | https://unsplash.com/photos/guADzpF9pDI | @zacharytheodore |
| crop-rows.jpg | https://unsplash.com/photos/xZqfw-VXnYE | @divaris |
| dar-brt.jpg | https://unsplash.com/photos/rxsICm9TK6s | @nichiyoshi |
| dar-aerial.jpg | https://unsplash.com/photos/lZLgqIiFHSw | @_phyllo |

These are stand-ins. Replace them with the client's own photography when it is available
(swap the file, keep the name, or edit `content/media.ts`).
