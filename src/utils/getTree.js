// utils/getTree.js

// 原始构造函数，返回完整树
export function buildTree(data, diseaseAttr, groupAttrs) {
    const root = { name: "root", children: [] };
  
    data.forEach((row) => {
      let current = root;
      groupAttrs.forEach((attr, i) => {
        const value = row[attr];
        let child = current.children.find((c) => c.name === `${attr}: ${value}`);
        if (!child) {
          child = { name: `${attr}: ${value}`, children: [] };
          current.children.push(child);
        }
        current = child;
      });
  
      const leafValue = row[diseaseAttr];
      let leaf = current.children.find((c) => c.name === `${diseaseAttr}: ${leafValue}`);
      if (!leaf) {
        leaf = { name: `${diseaseAttr}: ${leafValue}`, value: 0 };
        current.children.push(leaf);
      }
      leaf.value += 1;
    });
  
    return root;
  }
  
  // ✅ 加这一句兼容原结构
  export function getTree(data, groupAttrs, diseaseAttr = "stroke") {
    return buildTree(data, diseaseAttr, groupAttrs).children;
  }
  