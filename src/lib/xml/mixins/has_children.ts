import { XmlElement } from '../nodes/element.js';
import { XmlNode } from '../nodes/node.js';
import { createNameMatcher } from '../utils/name_matcher.js';
import { XmlNodeList } from '../utils/node_list.js';
import { EmtpyClass, type Constructor } from '../utils/apply_mixins.js';

export function WithXmlChildrenBase<TBase extends Constructor>(Base?: TBase) {
    if (Base === undefined) {
        Base = EmtpyClass as TBase;
    }
    return class extends Base {
        readonly children: Array<XmlNode> = [];
        readonly childElements: Iterable<XmlElement> = [];

        getElement(name: string, namespace?: string): XmlElement | undefined {
            return undefined;
        }

        readonly firstChild?: XmlNode = undefined;
        readonly firstElementChild?: XmlElement = undefined;
        readonly lastChild?: XmlNode = undefined;
        readonly lastElementChild?: XmlElement = undefined;
    };
}

const XmlChildrenBase = WithXmlChildrenBase();
type XmlChildrenBase = InstanceType<typeof XmlChildrenBase>;

function WithXmlHasChildren<TBase extends Constructor & XmlNode>(Base: TBase) {
    return class extends Base implements XmlChildrenBase {
        readonly children: XmlNodeList<TBase> = new XmlNodeList<TBase>();
        get childElements(): Iterable<XmlElement> {
            return this.children.filter((child): child is XmlElement => child instanceof XmlElement);
        }

        getElement(name: string, namespace?: string): XmlElement | undefined {
            return undefined;
        }

        readonly firstChild?: XmlNode = undefined;
        readonly firstElementChild?: XmlElement = undefined;
        readonly lastChild?: XmlNode = undefined;
        readonly lastElementChild?: XmlElement = undefined;
    };
}
