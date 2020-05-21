import Resource from './Resource';

export default class Relation extends Resource {
  constructor() {
    super();

    this.domains = [];
    this.ranges = [];
  }

  addRange(r) {
    if (this.ranges.indexOf(r) === -1) {
      this.ranges.push(r);
    }
  }

  addDomain(d) {
    this.domains.push(d);
  }

  integrateResource(src) {
    // adds stuff to this resource;
    super.integrateResource(src);

    src.domains.forEach(dom => {
      if (this.domains.indexOf(dom) === -1) {
        this.domains.push(dom);
      }
    });
    src.ranges.forEach(ran => {
      if (this.ranges.indexOf(ran) === -1) {
        this.ranges.push(ran);
      }
    });
    // extend with domain and range stuff;
  }
}
