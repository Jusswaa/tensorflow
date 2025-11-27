import * as tf from "@tensorflow/tfjs";

export async function createReorderModel() {
  const trainingX = tf.tensor2d([

    // CLEAR REORDER CASES (Low Stock, High Demand/Long Lead Time)
    [10, 30, 7], 
    [5, 50, 14],
    [15, 60, 5],
    [1, 10, 21],
    [12, 45, 10],
    [20, 70, 7],

    // MARGINAL REORDER CASES
    [30, 30, 10],
    [40, 50, 7],
    [25, 20, 14],

    // CLEAR NO REORDER CASES (High Stock, Low Demand/Short Lead Time)
    [150, 10, 3], 
    [80, 5, 7],
    [100, 25, 3],
    [65, 15, 10],
    [90, 20, 5],
    [200, 40, 7],
    [120, 30, 14],

    // MIXED/BORDERLINE CASES
    [45, 10, 21],
    [50, 35, 3],
    [75, 40, 10],
    [110, 50, 7],
    [10, 5, 7],
    [15, 10, 3],
    [25, 5, 14],
  ]);

  const trainingY = tf.tensor2d([
    // CLEAR REORDERS
    [1], [1], [1], [1], [1], [1],

    // MARGINAL REORDERS (Borderline)
    [1], [1], [1],

    // CLEAR NO REORDERS
    [0], [0], [0], [0], [0], [0], [0],

    // MIXED/BORDERLINE (Mostly No Reorder)
    [0], [0], [0], [0], [0], [0], [0],
  ]);

  const model = tf.sequential();
  model.add(tf.layers.dense({ inputShape: [3], units: 16, activation: "relu" }));
  model.add(tf.layers.dense({ units: 8, activation: "relu" })); 
  model.add(tf.layers.dense({ units: 1, activation: "sigmoid" }));

  model.compile({
    optimizer: tf.train.adam(0.01), 
    loss: "binaryCrossentropy",
    metrics: ["accuracy"],
  });

  await model.fit(trainingX, trainingY, { epochs: 300, shuffle: true });
  return model;
}

export async function predictReorder(model, product) {
  const input = tf.tensor2d([
    [product.inventory, product.avgSales, product.leadTime],
  ]);

  const result = model.predict(input);
  const value = (await result.data())[0];
  return value > 0.5 ? "Reorder" : "No Reorder";
}