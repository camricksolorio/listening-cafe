// Slot rectangles measured against the 1920x1080 background.png reference image,
// expressed as percentages of the image so they stay aligned at any render size.

export interface SlotRect {
  xPct: number;
  yPct: number;
  wPct: number;
  hPct: number;
}

const REFERENCE_WIDTH = 1920;
const REFERENCE_HEIGHT = 1080;

function rect(x: number, y: number, size: number): SlotRect {
  return {
    xPct: (x / REFERENCE_WIDTH) * 100,
    yPct: (y / REFERENCE_HEIGHT) * 100,
    wPct: (size / REFERENCE_WIDTH) * 100,
    hPct: (size / REFERENCE_HEIGHT) * 100,
  };
}

const SIDE_SLOT_SIZE = 186;
const TOP_SLOT_SIZE = 180;

export const LEFT_SHELF_SLOTS: SlotRect[] = [
  rect(292, 104, SIDE_SLOT_SIZE),
  rect(292, 354, SIDE_SLOT_SIZE),
  rect(292, 604, SIDE_SLOT_SIZE),
];

export const RIGHT_SHELF_SLOTS: SlotRect[] = [
  rect(1445, 104, SIDE_SLOT_SIZE),
  rect(1445, 354, SIDE_SLOT_SIZE),
  rect(1445, 604, SIDE_SLOT_SIZE),
];

export const TOP_SHELF_SLOTS: SlotRect[] = [565, 769, 973, 1177].map((x) => rect(x, 110, TOP_SLOT_SIZE));
