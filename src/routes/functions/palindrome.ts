import { Result } from "@merchandi/dmp-core-common-classes";
import { getRequestData} from "../../middleware";

/**
 * Palindrome
 */

const isPalindrome = (phrase: string): string => {
  console.log(phrase)
  console.log(typeof phrase)
  const original = phrase.toLowerCase().replace(/[^A-Za-z0-9]/g, '');
  const reversed = original.split('').reverse().join('');

  return original === reversed ? "Es Palindromo" : "No es Palindromo" 
}

const palidromeRoute = {
  method: "post",
  path: "/palindromo",
  middleware: [getRequestData],
  routeHandler: async (options: any) => {
    // Extract data
    
    const palidromo = options.data.palindromo;
    
    let result = isPalindrome(palidromo)
    // Create result
    const handlerResult = new Result({
      success: true,
      data: {
        result,
      },
    });

    // return result
    return handlerResult;
  },
};

export default palidromeRoute;
