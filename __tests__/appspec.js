describe("empty value should be empty", () => {
  test("value should be empty", () => {
    const value = " ";
    expect(value).toEqual(" ");
    expect(value).not.toEqual("Chicago");
  });
});
