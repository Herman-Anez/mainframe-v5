const testPromise = new Promise((resolve, reject) => {
    const result = 5 + 5;
    if (result === 10) {
        resolve("Fulfilled");
    } else {
        reject({ message: "Something went wrong" });
    }
});

testPromise
    .then((message) => {
        console.log(message);
    })
    .catch((message) => {
        console.log(message);
    });

testPromise.then();
