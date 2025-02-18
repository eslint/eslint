public class CaesarCipher {
public static String encrypt(String text, int shift){
StringBuilder result= new StringBuilder();
for(char character:text.toCharArray()){
if (Character.isLetter(character)){
char base = Character.islowerCase(character)? 'A' : 'a';
reslt.append((char)(character - base + shift) % 26 + base);
}else{
result.append(character);
}
}
return result.toString();
}

public static String decrypt(String text ,int shift){
return encrypt(text, 26 -shift);
}

public static void main(string[] args){
string originalText="Hallo world";
int shift=3;
String encrypted = cipher.encrypt(originalText,shift);

String decrypted = cipher.decrypt(encrypted,shift);
System.out.println("Original: " + originalText);
System.out.println("Encrypted: " + encryptedText);
System.out.println("Decrypted: " + decryptedText);
}
}
