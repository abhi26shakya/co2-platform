import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useDrawing } from "./use-drawing";
import { buildPickerResult } from "@/features/maps/components/gis-tools/lib/geo-math";

describe("useDrawing", () => {
  it("starts with no active tool and no drawings", () => {
    const { result } = renderHook(() => useDrawing());
    expect(result.current.drawingMode).toBe("none");
    expect(result.current.completedDrawings).toEqual([]);
  });

  it("toggleDrawingMode activates a tool, and toggling the same tool deactivates it", () => {
    const { result } = renderHook(() => useDrawing());
    act(() => result.current.toggleDrawingMode("polygon"));
    expect(result.current.drawingMode).toBe("polygon");
    act(() => result.current.toggleDrawingMode("polygon"));
    expect(result.current.drawingMode).toBe("none");
  });

  it("toggleDrawingMode switches directly between two tools", () => {
    const { result } = renderHook(() => useDrawing());
    act(() => result.current.toggleDrawingMode("circle"));
    act(() => result.current.toggleDrawingMode("rectangle"));
    expect(result.current.drawingMode).toBe("rectangle");
  });

  it("addDrawing appends the shape, resets the active tool, and clears the live measurement", () => {
    const { result } = renderHook(() => useDrawing());
    act(() => result.current.toggleDrawingMode("picker"));
    act(() => result.current.setLiveMeasurement("Coords Picker: 1.0000°, 2.0000°"));

    const drawing = buildPickerResult({ lat: 1, lon: 2 }, "abc");
    act(() => result.current.addDrawing(drawing));

    expect(result.current.completedDrawings).toEqual([drawing]);
    expect(result.current.drawingMode).toBe("none");
    expect(result.current.liveMeasurement).toBeNull();
  });

  it("removeDrawing removes only the targeted shape", () => {
    const { result } = renderHook(() => useDrawing());
    const a = buildPickerResult({ lat: 1, lon: 2 }, "a");
    const b = buildPickerResult({ lat: 3, lon: 4 }, "b");
    act(() => {
      result.current.addDrawing(a);
      result.current.addDrawing(b);
    });
    act(() => result.current.removeDrawing(a.id));
    expect(result.current.completedDrawings).toEqual([b]);
  });

  it("clearDrawings empties the list and bumps clearTrigger", () => {
    const { result } = renderHook(() => useDrawing());
    act(() => result.current.addDrawing(buildPickerResult({ lat: 1, lon: 2 }, "a")));
    const triggerBefore = result.current.clearTrigger;
    act(() => result.current.clearDrawings());
    expect(result.current.completedDrawings).toEqual([]);
    expect(result.current.clearTrigger).toBe(triggerBefore + 1);
  });

  it("exportGeoJSON reports failure when there is nothing to export", () => {
    const { result } = renderHook(() => useDrawing());
    const outcome = result.current.exportGeoJSON();
    expect(outcome).toEqual({ ok: false, reason: expect.stringContaining("No drawings") });
  });

  it("exportGeoJSON triggers a download when drawings exist", () => {
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
    const { result } = renderHook(() => useDrawing());
    act(() => result.current.addDrawing(buildPickerResult({ lat: 1, lon: 2 }, "a")));

    const outcome = result.current.exportGeoJSON();
    expect(outcome).toEqual({ ok: true });
    expect(clickSpy).toHaveBeenCalledTimes(1);
    clickSpy.mockRestore();
  });
});
