function Investment(initValue) {

    var calcStampDuty = function(propertyPrice) {
        var result;
        if (propertyPrice <= 14000) {
            result = propertyPrice * 0.0125;
        } else if (propertyPrice <= 30000) {
            result = 175 + (propertyPrice - 14000) * 0.015;
        } else if (propertyPrice <= 80000) {
            result = 415 + (propertyPrice - 30000) * 0.0175;
        } else if (propertyPrice <= 300000) {
            result = 1290 + (propertyPrice - 80000) * 0.035;
        } else if (propertyPrice <= 1000000) {
            result = 8990 + (propertyPrice - 300000) * 0.045;
        } else if (propertyPrice <= 3000000) {
            result = 40490 + (propertyPrice - 1000000) * 0.055;
        } else {
            result = 150490 + (propertyPrice - 3000000) * 0.07;
        }
        result += 20;
        return result;
    }

    var getStartValue = function() {
        var initInvestmentAmount = initValue.propertyPrice * initValue.depositRate + initValue.purchaseExpensive + calcStampDuty(initValue.propertyPrice);
        return  {
            year: 0,
            marketValue: initValue.propertyPrice,
            rent: initValue.rent,
            expenseNextYear: initValue.rateAndFeePerYear + initValue.otherexpensePerYear,
            ifSaveByCash: initInvestmentAmount,
            _ifSaveInBank: initInvestmentAmount,
            ifSaveIn10Rate: initInvestmentAmount,
            taxableIncome: 0,
            valueIncreasedAfterCGT: 0
        }
    }

    var calcValue = getStartValue();


    this.nextYear = function() {
        var income = calcValue.rent * 51;
        var interest = initValue.propertyPrice * (1 - initValue.depositRate) * initValue.interestRate;
        var expense = interest + calcValue.expenseNextYear;
        taxableIncome = income - expense;
        var taxReturn = -taxableIncome * initValue.taxRate;
        var outOfPocket = -taxableIncome - taxReturn;

        var marketValue = calcValue.marketValue * (1 + initValue.propertyPriceIncreaseRatePerYear);
        var ifSaveInBank = calcValue._ifSaveInBank * (1 + initValue.interestRate) + outOfPocket;
        var valueIncreasedAfterCGT = (marketValue - initValue.propertyPrice) * (1 - initValue.highestTaxRate / 2);
        var sellAndGetCash = valueIncreasedAfterCGT + initValue.propertyPrice * initValue.depositRate;
        calcValue = {
            year: calcValue.year + 1,
            marketValue: marketValue,
            rent: initValue.rentIncreasePerYear >= 1 ? calcValue.rent + initValue.rentIncreasePerYear : calcValue.rent * (1 + initValue.rentIncreasePerYear),
            expenseNextYear: calcValue.expenseNextYear * (1 + initValue.expenseIncreaseRatePerYear),
            outOfPocketThisYear: outOfPocket,
            //taxableIncome: taxableIncome,
            valueIncreasedAfterCGT: valueIncreasedAfterCGT,
            ifSaveByCash: calcValue.ifSaveByCash + outOfPocket,
            _ifSaveInBank: ifSaveInBank,
            ifSaveIn10Rate: calcValue.ifSaveIn10Rate * 1.10 + outOfPocket,
            _sellAndGetCash: sellAndGetCash,
            compareWithBank: sellAndGetCash - ifSaveInBank
        }
        return calcValue;
    }
}