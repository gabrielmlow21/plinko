const outputs = [];
const predictionPoint = 300;
const k = 3;

const onScoreUpdate = (dropPosition, bounciness, size, bucketLabel) => 
  outputs.push([dropPosition, bounciness, size, bucketLabel])

const runAnalysis = () => {
  const bucket = _.chain(outputs)
    .map(row => [distance(row[0]), row[3]])  // [distance of dropPosition from predictionPoint, bucket]
    .sortBy(row => row[0])  // sort based on distance of dropPosition from predictionPoint
    .slice(0, k)  // take first k elements
    .countBy(row => row[1])  // count the occurrence of each bucket and returns object of objects, i.e. {bucket: occurrence}
    .toPairs()  // converts result to array of arrays. i.e. [bucket, occurrence]
    .sortBy(row => row[1])  // sort based on array element with occurrence value (ascending)
    .last()  // get array element with highest occurrence value
    .first()  // get first element of the array (the bucket number)
    .parseInt()  // convert to int
    .value();  // stop chain operation
  
    console.log('Your point will probably fall into ' + bucket);
}

// calculate distance of a point from the predictionPoint
const distance = point => Math.abs(point - predictionPoint);

// splits the dataset into a dataset for testing and for training
const splitDataset = (data, testCount) => {
  const shuffled = _.shuffle(data);
  const testSet = _.slice(shuffled, 0, testCount);
  const trainingSet = _.slice(shuffled, testCount);
  return [testSet, trainingSet];
}