import ClientError from "../ClientError.js";

describe("ClientError", () => {
  it("should throw error when directly use it", () => {
    expect(() => new ClientError("")).toThrowError(
      "cannot instantiate abstract class"
    );
  });
});

describe("Skenario Gagal CI", () => {
  it("seharusnya sengaja gagal", () => {
    expect(1 + 1).toEqual(3);
  });
});
