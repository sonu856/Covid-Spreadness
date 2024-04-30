const TRAVEL_PROB_5KM = 0.8;
const TRAVEL_PROB_12KM = 0.4;

function simulateSpread(startLocation, numDays, radius, assuranceProb) {
    let queue = [{ location: startLocation, distance: 0 }];
    let infectedLocations = new Set();
    infectedLocations.add(startLocation);

    for (let day = 0; day < numDays; day++) {
        let newInfected = [];

        for (let { location, distance } of queue) {
            let newDistance = getNewDistance(distance, radius, assuranceProb);
            let newLocation = getNewLocation(location, newDistance, radius);

            if (!infectedLocations.has(newLocation.toString())) {
                infectedLocations.add(newLocation.toString());
                newInfected.push({ location: newLocation, distance: newDistance });
            }
        }

        queue = newInfected;
    }

    return infectedLocations.size;
}

function getNewDistance(currentDistance, radius, assuranceProb) {
    let probability;
    if (currentDistance === 5) {
        probability = TRAVEL_PROB_5KM;
    } else if (currentDistance === 12) {
        probability = TRAVEL_PROB_12KM;
    } else {
        probability = calculateDistanceProbability(currentDistance, TRAVEL_PROB_5KM, TRAVEL_PROB_12KM);
    }

    let numNewDistances = Math.ceil(-Math.log(1 - assuranceProb) / Math.log(1 - probability));
    let newDistances = [];
    for (let i = 0; i < numNewDistances - 1; i++) {
        newDistances.push(currentDistance);
    }
    newDistances.push(radius);

    return newDistances[Math.floor(Math.random() * newDistances.length)];
}


function calculateDistanceProbability(distance, prob5Km, prob12Km) {
    if (distance <= 5) {
        return prob5Km;
    } else if (distance >= 12) {
        return prob12Km;
    } else {
        return prob5Km + (distance - 5) * (prob12Km - prob5Km) / (12 - 5);
    }
}

function getNewLocation(location, distance, radius) {
    let angle = Math.random() * 2 * Math.PI;
    let newX = location[0] + distance * Math.cos(angle);
    let newY = location[1] + distance * Math.sin(angle);
    return [Math.round(newX), Math.round(newY)];
}

function main() {
    const initialInfected = [0, 0];
    const numDays = 5;
    const radius = 12;
    const assuranceProb = 0.98;

    const totalPopulation = simulateSpread(initialInfected, numDays, radius, assuranceProb);
    console.log(`Total population after ${numDays} days: ${totalPopulation}`);
}

main();
