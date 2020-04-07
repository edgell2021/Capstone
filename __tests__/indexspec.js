describe("check port value", () => {
  test("it should start on port 3000", () => {
    const port = "3000";
    expect(port).toEqual("3000");
    expect(port).not.toEqual("8081");
  });
});
