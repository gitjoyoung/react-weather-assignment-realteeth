
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.resolve(__dirname, '../src/entities/location/data/korea_districts.json');
const outputPath = path.resolve(__dirname, '../src/entities/location/data/korea_districts_tree.json');

const rawData = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

const tree = {};

rawData.forEach(item => {
  const parts = item.split('-');
  let currentLevel = tree;

  parts.forEach((part, index) => {
    // If we are at the last part, we prefer storing it in an array if possible (leafs)
    // But structure might be mixed. Let's use objects for everything except pure leaves eventually?
    // Actually, mixing objects and arrays is tricky.
    // Let's stick to Object structure where keys are the names.
    // If a node is a leaf in the original path, we mark it?
    // The original data has "A", "A-B", "A-B-C".
    // So "A" is a node. "A"'s children are in "A" object.
    
    if (!currentLevel[part]) {
      currentLevel[part] = {};
    }
    currentLevel = currentLevel[part];
  });
});

// Optimization: Convert leaf objects that have no children into something smaller?
// Or just keep it as nested empty objects?
// {"서울특별시": {"종로구": {"청운동": {}, "신교동": {}}}} 
// This is still JSON with lots of quotes and braces.
// Better format:
// {"서울특별시": { "종로구": ["청운동", "신교동", ...] } }
// If we encounter a node that has *only* leaves as children, convert to array.

function optimizeTree(node) {
  const keys = Object.keys(node);
  if (keys.length === 0) return null; // Truly leaf with no further path
  
  // Check if all children are empty (meaning they are the end of the chain)
  const allChildrenEmpty = keys.every(key => Object.keys(node[key]).length === 0);
  
  if (allChildrenEmpty) {
    return keys; // Convert {a:{}, b:{}} to ["a", "b"]
  }

  // Otherwise recurse
  const newObj = {};
  for (const key of keys) {
    const result = optimizeTree(node[key]);
    newObj[key] = result;
  }
  return newObj;
}

const optimizedTree = optimizeTree(tree);

fs.writeFileSync(outputPath, JSON.stringify(optimizedTree), 'utf8'); // No extra spaces for minification
console.log(`Optimized districts saved to ${outputPath}`);
