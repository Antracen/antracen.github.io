# Run this to create all project HTML files

import csv, shutil, fileinput

with open('Projects.csv') as csvfile:
	csvreader = csv.reader(csvfile)
	for row in csvreader:
		print(row)
		with open('projecttemplate.html', 'r') as file:
			filedata = file.read()
		filedata = filedata.replace('PROJECTTITLE', format(row[0]))
		filedata = filedata.replace('PROJECTFILE', format(row[1]))
		with open("{0}.html".format(row[2]), 'w') as file:
			file.write(filedata)
