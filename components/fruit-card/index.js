// components/fruit-card/index.js
Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    image: {
      type: String,
      value: ''
    },
    name: {
      type: String,
      value: ''
    },
    description: {
      type: String,
      value: ''
    },
    price: {
      type: String,
      value: ''
    },
    tags: {
      type: Array,
      value: []
    },
    rating: {
      type: Number,
      value: 0
    },
    showTags: {
      type: Boolean,
      value: false
    },
    showRating: {
      type: Boolean,
      value: false
    }
  },
  data: {

  },
  methods: {
    onTap() {
      this.triggerEvent('tap');
    }
  }
});