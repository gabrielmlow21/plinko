const outputs = [];

const onScoreUpdate = (dropPosition, bounciness, size, bucketLabel) => 
  outputs.push([dropPosition, bounciness, size, bucketLabel])

const runAnalysis = () => {
  const testSetSize = 50;
  const [testSet, trainingSet] = splitDataset(outputs, testSetSize);
  _.range(1, 15).forEach(k => {
    const accuracy = _.chain(testSet)
      .filter(testPoint => knn(trainingSet, testPoint[0], k) === testPoint[3])
      .size()
      .divide(testSetSize)
      .value();
    console.log('For k of', k, 'accuracy is', accuracy);
  });
}

const knn = (data, point, k) => 
  _.chain(data)
    .map(row => [distance(row[0], point), row[3]])  // [distance of dropPosition from predictionPoint, bucket]
    .sortBy(row => row[0])  // sort based on distance of dropPosition from predictionPoint
    .slice(0, k)  // take first k elements
    .countBy(row => row[1])  // count the occurrence of each bucket and returns object of objects, i.e. {bucket: occurrence}
    .toPairs()  // converts result to array of arrays. i.e. [bucket, occurrence]
    .sortBy(row => row[1])  // sort based on array element with occurrence value (ascending)
    .last()  // get array element with highest occurrence value
    .first()  // get first element of the array (the bucket number)
    .parseInt()  // convert to int
    .value();  // stop chain operation

// calculate distance of 2 points
const distance = (pointA, pointB) => Math.abs(pointA - pointB);

// splits the dataset into a dataset for testing and for training
const splitDataset = (data, testCount) => {
  const shuffled = _.shuffle(data);
  const testSet = _.slice(shuffled, 0, testCount);  // the first until the testCount'th data will be used as test sets
  const trainingSet = _.slice(shuffled, testCount);  // the rest are training sets
  return [testSet, trainingSet];
}