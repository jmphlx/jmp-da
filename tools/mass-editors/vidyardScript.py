import csv, os
from collections import defaultdict

d = defaultdict(list)
with open('book1.csv', 'r', newline='') as f:
    reader = csv.reader(f)
    next(reader) # toss headers
    for ticket, asset in reader:
        d[ticket].append(asset)
# print(d)

directory = "/Users/drewcummings/Nextcloud/Arbory Digital General/Clients/JMP/jmp-da-migration/en-us/learning-library/topics/test folder"

def gizmo(directory,d):
    for path, folders, files in os.walk(directory):
        for folder_name in folders:
            gizmo(os.path.join(directory, folder_name),d)

        for name in files:
            with open(os.path.join(directory, name), "r") as f_in:
                # print(name)
                filedata = f_in.read()

            for key in d.keys():
                if key in filedata:
                    url = "https://share.vidyard.com/watch/" + d.get(key)[0]
                    filedata = filedata.replace(key, url)
                    print("START")
                    print(key)
                    print(d.get(key)[0])
                    print(name)
                    # print(filedata)
                    print("END")

            with open(os.path.join(directory, name), "w") as f_out:
                f_out.write(filedata)
                f_out.close()

gizmo(directory,d)

