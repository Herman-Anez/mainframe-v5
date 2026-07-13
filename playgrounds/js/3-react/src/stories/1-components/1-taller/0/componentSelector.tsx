import ComponentSelector from "./compponent/componentSelector.component";
import withSelectorState from "./compponent/componentSelector.utils";

const componentSelector = {
    Dumb: ComponentSelector,
    Stateful: withSelectorState(ComponentSelector),
};

export default componentSelector;
