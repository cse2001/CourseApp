import matplotlib.pyplot as plt
import sys, json

def main(data, userEmail, courseId):
    print("Running python script...")
    print(data)

    gradevalues = [float(v) for v in data.values()]
    gradeheaders = [k for k in data.keys()]

    index = [i for i in range(len(gradeheaders))]
    
    # plt.figure(figsize=(10, 10))
    plt.bar(index, gradevalues, color='blue', width=0.2)
    plt.xlabel('Exams')
    plt.ylabel("Scores")
    #plt.grid(b='on')
    plt.xticks(index, gradeheaders)
    # plt.ylim(0, 10)
    # plt.yticks(range(0, 11))

    for i in range(len(gradevalues)):
      plt.text(x = index[i]-0.1, y = gradevalues[i]+0.05, s = gradevalues[i], size = 10)
    
    plotPath = f'./public/courseId_{courseId}/Grades/{userEmail + "_plot.png"}'
    plt.savefig(plotPath, bbox_inches='tight')
    # plt.show()
    return 0

if __name__ == "__main__":
    data = json.loads(sys.argv[1])
    userEmail = sys.argv[2]
    courseId = sys.argv[3]
    sys.exit(main(data, userEmail, courseId))