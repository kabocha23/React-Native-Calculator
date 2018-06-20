import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import InputNumberButton from './src/components/InputNumberButton';

const buttons = [
  [ 'CLEAR', 'DEL'],
  ['7','8','9', '÷' ],
  ['4','5','6', 'x' ],
  ['1','2','3', '-' ],
  [ '0', '.', '=', '+' ],
]

export default class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      displayValue: '0',
      operator: null,
      valOne: '',
      valTwo: '',
      valResult: '',
    }
  }

  componentDidUpdate(){
    console.log(this.state)
  }

  renderButtons() {
    let layouts = buttons.map((buttonRows, index) => {
      let rowItem = buttonRows.map((buttonItems, buttonIndex) => {
        return <InputNumberButton 
          value={buttonItems}
          handleOnPress={this.handleInput.bind(this, buttonItems)}
          key={'btn-' + buttonIndex}
        />
      });

      return <View 
        style={styles.inputRow} 
        key={'row-' + index}
      >
        {rowItem}
      </View>
    });

    return layouts;
  }

  handleInput = (input) => {
    const { displayValue, operator, valOne, valTwo, valResult } =  this.state;
    switch (input) {
      case '+':
      case '-':
      case 'x':
      case '÷':
        this.setState({
          operator: input,
          displayValue: (operator !== null ? displayValue.substr(0, displayValue.length-1) : displayValue) + input,
        })
        break;

      case '.':
        let lastCharDecimal = displayValue.toString().slice(-1)
        console.log('lastCharDecimal' + lastCharDecimal)
        this.setState({
          displayValue: lastCharDecimal !== '.' ? displayValue + input : displayValue,
        })
        
        if (!operator) {
          this.setState({
            valOne: (valOne === 0) ? input : valOne + input, 
          })
        } else {
          this.setState({
            valTwo: valTwo + input, 
          })
        }
        break;

      case '=':
        let formattedOperator = (operator == 'x') ? '*' : (operator == '÷') ? '/' : operator;
        let result = eval(valOne + formattedOperator + valTwo);
        this.setState({
          displayValue: result % 1 === 0 ? result : result.toFixed(2),
          operator: null,
          valOne: '',
          valTwo: '',
          valResult: result % 1 === 0 ? result : result.toFixed(2),
        })
        break;

      case 'CLEAR':
        this.setState({
          displayValue: '0',
          operator: null,
          valOne: '',
          valTwo: '',
          valResult: '',
        })
        break;

      case 'DEL':
        let displayToStr = displayValue.toString();
        let deletedChar = displayToStr.substr(displayToStr.length-1, 1);
        let deletedStr = displayToStr.substr(0, displayToStr.length-1);
        this.setState({
          displayValue: displayToStr.length == 1 ? '0' : deletedStr,
          operator: (deletedChar == '+' || deletedChar == '-' || deletedChar == '÷' || deletedChar == 'x') ? '' : operator,
          valOne: displayToStr.length == 1 ? '' : deletedStr,
        })
        break;

      default:
        this.setState({
          displayValue: (displayValue === '0' || displayValue == 0) ? input : displayValue + input,
        })

        if (!operator) {
          this.setState({
            valOne: (valOne === '0' || valOne == 0) ? input : valOne + input,
          })
        } else {
          this.setState({
            valTwo: valTwo + input, 
          })
        }
        break;
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>{this.state.displayValue}</Text>
        </View>
        <View style={styles.inputContainer}>
          {this.renderButtons()}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  resultContainer: {
    flex: 2,
    justifyContent: 'center',
    backgroundColor: '#0080E5',
  },
  resultText: {
    color: 'white',
    fontSize: 50,
    fontWeight: 'bold',
    padding: 10,
    marginTop: 5,
    textAlign: 'right',
  },
  inputContainer: {
    flex: 8,
    backgroundColor: '#008FFF',
  },
  inputRow: {
    flex: 1,
    flexDirection: 'row',
  },
});
