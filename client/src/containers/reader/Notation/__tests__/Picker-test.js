import React from "react";
import renderer from "react-test-renderer";
import { NotationPickerContainer } from "../Picker";
import { Provider } from "react-redux";
import build from "test/fixtures/build";
import { wrapWithRouter } from "test/helpers/routing";

describe("Reader Notation Resource Picker Container", () => {
  const store = build.store();
  const resources = [build.entity.resource("1"), build.entity.resource("2")];
  const resourcesMeta = {
    pagination: build.pagination()
  };
  const props = {
    resources,
    resourcesMeta,
    collections: [],
    collectionsMeta: {},
    history: {},
    match: {
      params: {
        textId: "2",
        sectionId: "3"
      }
    },
    dispatch: store.dispatch
  };

  const component = renderer.create(
    wrapWithRouter(
      <Provider store={store}>
        <NotationPickerContainer {...props} />
      </Provider>
    )
  );

  it("renders correctly", () => {
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("doesn't render to null", () => {
    let tree = component.toJSON();
    expect(tree).not.toBe(null);
  });
});
