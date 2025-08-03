def multiply_numbers(a, b):
    """计算两个数字的乘积"""
    return a * b

def main():
    try:
        num1 = float(input("请输入第一个数字: "))
        num2 = float(input("请输入第二个数字: "))
        
        result = multiply_numbers(num1, num2)
        print(f"{num1} × {num2} = {result}")
        
    except ValueError:
        print("错误：请输入有效的数字")

if __name__ == "__main__":
    main()