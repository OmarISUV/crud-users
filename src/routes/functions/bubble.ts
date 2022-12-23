import { Result } from "@merchandi/dmp-core-common-classes";
import { getRequestData, sendEvents } from "../../middleware";
import { SVC_NAME } from "../../config";

function bubbleSort(array:number[]):number[]{
    array = array.slice();
    for( let i=0;i<array.length;i++){ 
      for(let j=0;j<array.length-1;j++){
        if(array[j] > array[j+1]){
          [array[j], array[j+1]] =[array[j+1],array[j]];
        }
      }
    }
    
    return array;
  }

/**
 * Bubble Sort
 */
const bubbleRoute = {
  method: "post",
  path: "/bubble",
  middleware: [getRequestData, sendEvents],
  routeHandler: async (options: any) => {
    // Extract data
    const arrayNumber = options.data.arrayNumber;


    let result = bubbleSort(arrayNumber)
    // Create result
    const handlerResult = new Result({
      success: true,
      data: {
        result
      },
    });

    // return result
    return handlerResult;
  },
};

export default bubbleRoute;
