import argparse
import sys
from typing import Tuple
from uuid import uuid4


def test(x: int, y: int):
    while x < y:
        yield x
        x += 1
        print("+1")


def testTwo(x: int, y: int):
    print("cool")
    yield x
    print("yoyo")


def testTwos(x: list[str, int]):
    x.append(5)
    print(x)


# testTwos([1, 2, 3])

if __name__ == "__main__":
    paser = argparse.ArgumentParser(description="hello")
    paser.add_argument("--platform", type=str, help="yoyo", choices=["a", "b"])
    args = paser.parse_args()
    print(args.platform)

# result = testTwo(1, 5)

# for i in result:
#     print(i)

# print(result.__next__())
# print("before next")
# print(result.__next__())
# print("finish")


# result = test(1, 5)
# print(result.__next__())
# print("before next")
# print(result.__next__())
# for i in result:
#     print("i=" + str(i))

# print(f"{uuid4()}")


# class testOne:
#     def __init__(self, x: int, y: int):
#         self.x = x
#         self.y = y

#     def __enter__(self):
#         print("__enter__")
#         return self

#     def __exit__(self, exc_type, value, traceback):
#         print(self.x)
#         print("__exit__")


# def yoyo():
#     with testOne(1, 2) as a:
#         print("proudct")


# yoyo()
