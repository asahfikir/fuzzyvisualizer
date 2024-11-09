export class DecisionTree {
  constructor(
    feature = null,
    threshold = null,
    left = null,
    right = null,
    classLabel = null,
  ) {
    this.feature = feature; // Feature to split on (e.g., 'X1' or 'X2')
    this.threshold = threshold; // Threshold value for the split (e.g., 5)
    this.left = left; // Left child node
    this.right = right; // Right child node
    this.classLabel = classLabel; // Class label if it's a leaf node
  }

  // Method to add a decision node
  addNode(feature, threshold, left = null, right = null) {
    this.feature = feature;
    this.threshold = threshold;
    this.left = left;
    this.right = right;
  }

  // Method to set as a leaf node with a class label
  setLeaf(classLabel) {
    this.classLabel = classLabel;
  }

  // Recursive prediction method
  predict(sample) {
    // If it's a leaf node, return the class label
    if (this.classLabel !== null) {
      return this.classLabel;
    }

    // Choose the branch based on the feature and threshold
    if (sample[this.feature] <= this.threshold) {
      return this.left.predict(sample);
    } else {
      return this.right.predict(sample);
    }
  }

  // Let's visualize the structure
  getStructure(depth = 0) {
    if (this.classLabel !== null) {
      return `${" ".repeat(depth * 2)}Class: ${this.classLabel}`;
    }

    let structure = `${" ".repeat(depth * 2)}If ${this.feature} <= ${this.threshold}:\n`;
    structure += `${this.left.getStructure(depth + 1)}\n`;
    structure += `${" ".repeat(depth * 2)}Else:\n`;
    structure += `${this.right.getStructure(depth + 1)}`;

    return structure;
  }
}
