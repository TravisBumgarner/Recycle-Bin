import React, { Component } from 'react';
import { connect } from 'react-redux';

import { CategoriesWrapper } from './Categories.styles';

export class Categories extends Component {
  render() {
    const {
      categories,
    } = this.props;

    const CategoryListItems = categories.map((c) => {
      return <div key={c.name}>{ c.name }</div>;
    });

    return (
      <CategoriesWrapper>
        { CategoryListItems }
      </CategoriesWrapper>
    );
  }
}

export default connect(state => ({
  categories: state.categories.all,
}), {

})(Categories);
