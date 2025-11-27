import * as tf from "@tensorflow/tfjs";

export async function createReorderModel() {
  const trainingX = tf.tensor2d([
    [20, 50, 3],
    [5, 30, 5],
    [15, 40, 4],
    [8, 60, 2],
  ]);

  const trainingY = tf.tensor2d([[0], [1], [0], [1]]);

  const model = tf.sequential();
  model.add(tf.layers.dense({ inputShape: [3], units: 8, activation: "relu" }));
  model.add(tf.layers.dense({ units: 1, activation: "sigmoid" }));

  model.compile({
    optimizer: "adam",
    loss: "binaryCrossentropy",
    metrics: ["accuracy"],
  });

  await model.fit(trainingX, trainingY, { epochs: 200, shuffle: true });
  return model;
}

export async function predictReorder(model, product) {
  const input = tf.tensor2d([[
    product.inventory,
    product.avgSales,
    product.leadTime
  ]]);

  const result = model.predict(input);
  const value = (await result.data())[0];
  return value > 0.5 ? "Reorder" : "No Reorder";
}
