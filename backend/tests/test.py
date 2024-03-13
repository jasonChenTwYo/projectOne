from uuid import uuid4


def test(x: int, y: int):
    while x < y:
        yield x
        x += 1
        print("+1")


result = test(1, 5)
print(result.__next__())
print("before next")
print(result.__next__())
for i in result:
    print(i)

print(f"{uuid4()}")
