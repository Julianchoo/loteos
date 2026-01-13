# AutoCAD to React SVG Replacement Guide

Follow these steps to replace the placeholder map with your actual AutoCAD layout:

## 1. Export from AutoCAD
1. Open your DWG/AutoCAD file.
2. Export the lot layout as an **SVG** file.
3. Ensure each lot is a separate `<path>` or `<polygon>`.

## 2. Prepare the SVG
Clean the SVG file (you can use [SVGOMG](https://jakearchibald.github.io/svgomg/)) and identify the specific paths for each lot. Ideally, you should have an attribute like `id="lot-1"` or `data-number="1"` in the SVG export.

## 3. Replace in Code
Open `src/components/lot-map-placeholder.tsx` and replace the placeholder `<svg>` element (lines 42-93) with your new SVG content.

### Example Mapping Logic
Wrap your paths in a React mapping function if possible, or manually add the `onClick` handlers:

```tsx
<path
  d="..." // Your AutoCAD path
  className="hover:fill-primary transition-colors cursor-pointer"
  onClick={() => setSelectedLot(lots.find(l => l.number === "1") ?? null)}
/>
```

## 4. Automatic Linking (Advanced)
If your SVG paths have IDs matching the lot numbers, you can use a ref to add listeners automatically:

```javascript
useEffect(() => {
  const paths = mapRef.current.querySelectorAll('path');
  paths.forEach(path => {
    path.onclick = () => {
      const lotNum = path.getAttribute('id').replace('lot-', '');
      setSelectedLot(lots.find(l => l.number === lotNum));
    };
  });
}, [lots]);
```
