class Map {
    data = [];
    dataSize = 0;

    constructor(data) {
        this.addElements(data);
    }

    addElements(data) {
        data.forEach(element => {
            this.addElement(element);
        });
    }

    addElement(element) {
        if (this.data[element.id] === undefined) {
            this.dataSize++;
        }
        this.data[element.id] = element;
    }

    addChildren(children, property) {
        children.forEach(child => {
            this.addChild(child, property);
        });
    }

    addChild(child, property) {
        if (this.data[child[property]].children === undefined) {
            this.data[child[property]].children = [];
            this.data[child[property]].childrenSize = 0;
        }

        if (this.data[child[property]].children[child.id] === undefined) {
            this.data[child[property]].childrenSize++;
        }
        this.data[child[property]].children[child.id] = child;
    }

    getAll() {
        return this.data;
    }

    getById(id) {
        return data[id];
    }

    size() {
        return this.dataSize;
    }
}

export default Map;
