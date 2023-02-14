class Transaction {
  constructor(inputUTXOs, outputUTXOs) {
    this.inputUTXOs = inputUTXOs;
    this.outputUTXOs = outputUTXOs;
    this.fee = 0;
  }
  execute() {
    let totalInputAmount = 0;
    for (let i = 0; i < this.inputUTXOs.length; i++) {
      const utxo = this.inputUTXOs[i];

      if (utxo.spent) {
        // if there is error undo spent for input utxo

        for (let j = 0; j < i - 1; j++) {
          const utxo = this.inputUTXOs[j];
          utxo.spent = false;
        }

        throw Error("already spent!");
      }
      utxo.spend();
      totalInputAmount += utxo.amount;
    }

    let totalOuputAmount = 0;
    for (let i of this.outputUTXOs) {
      totalOuputAmount += i.amount;
    }

    if (totalInputAmount < totalOuputAmount) {
      // undo transaction
      for (let j = 0; j < this.inputUTXOs.length; j++) {
        const utxo = this.inputUTXOs[j];
        utxo.spent = false;
      }
      throw Error("the inputs is less than the total value of the outputs");
    }
    this.fee = totalInputAmount - totalOuputAmount;
  }
}

module.exports = Transaction;
