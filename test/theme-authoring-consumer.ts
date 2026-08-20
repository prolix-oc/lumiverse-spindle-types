import type {
  SpindleFrontendContext,
  SpindleThemeComponentCatalogEntry,
  SpindleThemePackDraft,
  SpindleUploadFile,
} from "lumiverse-spindle-types";

declare const ctx: SpindleFrontendContext;
declare const upload: SpindleUploadFile;
declare const archive: Uint8Array;

const draft: SpindleThemePackDraft = {
  name: "Visual Theme",
  globalCSS: ":root { --lumiverse-primary: #c084fc; }",
  components: {
    BubbleMessage: { css: "color: var(--lumiverse-text);", enabled: true },
  },
};

ctx.theme.assets.upload(upload, { bundleId: "bundle-id" }).then((asset) => {
  const preview: string = asset.contentUrl;
  const stylesheetReference: string = asset.cssPath;
  void preview;
  void stylesheetReference;
});

const exported: Promise<Uint8Array> = ctx.theme.packs.exportDraft(draft);
ctx.theme.packs.importArchive(archive).then((result) => {
  const imported: SpindleThemePackDraft = result.draft;
  void imported;
});

const component: SpindleThemeComponentCatalogEntry = ctx.theme.catalog.listComponents()[0]!;
const selector: string = component.selector;
// @ts-expect-error catalog entries intentionally expose no source or filesystem path
component.cssPath;
void selector;
void exported;

const draftWithTsx: SpindleThemePackDraft = {
  name: "Unsafe input",
  globalCSS: "",
  components: {
    BubbleMessage: {
      css: "",
      // @ts-expect-error theme pack drafts deliberately cannot provide component TSX
      tsx: "export default function Replacement() {}",
    },
  },
};
void draftWithTsx;
