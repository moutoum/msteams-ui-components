import { tab as tabClasses } from 'msteams-ui-styles-core/dist/typestyle-binding/tab';
import * as PropTypes from 'prop-types';
import * as React from 'react';
import { connectTeamsComponent, InjectedTeamsProps } from '../index';
import { TabContext, TabContextType } from './index';
import { TabProps, TabPropTypes } from './tab';

export interface TabGroupProps
  extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  children: Array<React.ReactElement<TabProps>>;
  selectedTabId: any;
}

class TabGroupInternal extends React.Component<InjectedTeamsProps & TabGroupProps, {}> {
  static childContextTypes = TabContextType;

  static propTypes = {
    children: PropTypes.arrayOf(PropTypes.shape({
      props: PropTypes.shape(TabPropTypes).isRequired,
    })).isRequired,
  };

  getChildContext(): TabContext {
    if (process.env.NODE_ENV !== 'production') {
      const childTabIds = new Set<string>();
      React.Children.forEach(this.props.children, (tab: React.ReactElement<TabProps>) => {
        if (childTabIds.has(tab.props.tabId)) {
          throw new Error(`Duplicated tab id: ${tab.props.tabId}`);
        }
        childTabIds.add(tab.props.tabId);
      });
    }

    return {
      isSelected: (tabId: any) => tabId === this.props.selectedTabId,
    };
  }

  render() {
    const { context, selectedTabId, ...rest } = this.props;
    const themeClassNames = tabClasses(context);
    return (
      <div className={themeClassNames.container} {...rest}>
        {this.props.children}
      </div>
    );
  }
}

export const TabGroup = connectTeamsComponent<TabGroupProps>(TabGroupInternal);
