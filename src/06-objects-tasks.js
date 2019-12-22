/* ************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectagle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  return {
    width,
    height,
    getArea() {
      return this.width * this.height;
    },
  };
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const obj = JSON.parse(json);
  return Object.setPrototypeOf(obj, proto);
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurences
 *
 * All types of selectors can be combined using the combinators ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string repsentation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

const cssSelectorBuilder = {
  selectorStr: '',
  order: 0,
  isCB: false,
  priorityDictionary: {
    element: 1,
    id: 2,
    class: 3,
    attr: 4,
    pseudoClass: 5,
    pseudoElement: 6,
  },
  uniquePositions: [1, 2, 6],
  errors: {
    occurenceError: 'Element, id and pseudo-element should not occur more then one time inside the selector',
    orderError: 'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element',
  },

  addPart(params) {
    const order = this.priorityDictionary[params.part];
    this.checkCorrectness(order);
    const closureBuilder = params.initCB;
    closureBuilder.selectorStr += params.partValue;
    closureBuilder.order = order;

    return closureBuilder;
  },

  checkCorrectness(currOrder) {
    const flags = {
      orderCorrect: this.checkOrder(currOrder),
      occurenceCorrect: this.checkOccurences(currOrder),
    };

    if (!flags.orderCorrect) throw new Error(this.errors.orderError);
    if (!flags.occurenceCorrect) throw new Error(this.errors.occurenceError);
  },

  checkOccurences(order) {
    if (this.order === order && this.uniquePositions.includes(order)) {
      return false;
    }
    return true;
  },

  checkOrder(order) {
    if (this.order > order) {
      return false;
    }

    return true;
  },

  element(value) {
    let initCB;

    if (!this.isCB) {
      initCB = { ...cssSelectorBuilder };
      initCB.isCB = true;
    } else {
      initCB = this;
    }
    const cb = this.addPart({
      part: 'element',
      partValue: value,
      initCB,
    });

    return cb;
  },

  id(value) {
    let initCB;

    if (!this.isCB) {
      initCB = { ...cssSelectorBuilder };
      initCB.isCB = true;
    } else {
      initCB = this;
    }
    const cb = this.addPart({
      part: 'id',
      partValue: `#${value}`,
      initCB,
    });

    return cb;
  },

  class(value) {
    let initCB;

    if (!this.isCB) {
      initCB = { ...cssSelectorBuilder };
      initCB.isCB = true;
    } else {
      initCB = this;
    }
    const cb = this.addPart({
      part: 'class',
      partValue: `.${value}`,
      initCB,
    });

    return cb;
  },

  attr(value) {
    let initCB;

    if (!this.isCB) {
      initCB = { ...cssSelectorBuilder };
      initCB.isCB = true;
    } else {
      initCB = this;
    }
    const cb = this.addPart({
      part: 'attr',
      partValue: `[${value}]`,
      initCB,
    });

    return cb;
  },

  pseudoClass(value) {
    let initCB;

    if (!this.isCB) {
      initCB = { ...cssSelectorBuilder };
      initCB.isCB = true;
    } else {
      initCB = this;
    }
    const cb = this.addPart({
      part: 'pseudoClass',
      partValue: `:${value}`,
      initCB,
    });

    return cb;
  },

  pseudoElement(value) {
    let initCB;

    if (!this.isCB) {
      initCB = { ...cssSelectorBuilder };
      initCB.isCB = true;
    } else {
      initCB = this;
    }
    const cb = this.addPart({
      part: 'pseudoElement',
      partValue: `::${value}`,
      initCB,
    });

    return cb;
  },

  combine(selector1, combinator, selector2) {
    const closureBuilder = { ...cssSelectorBuilder };
    closureBuilder.selectorStr = `${selector1.stringify()} ${combinator} ${selector2.stringify()}`;

    return closureBuilder;
  },

  clearString() {
    this.selectorStr = '';
    this.order = 0;
  },

  stringify() {
    const currStr = this.selectorStr;
    this.clearString();

    return currStr;
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
