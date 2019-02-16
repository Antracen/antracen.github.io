# TODO:
	# Selective library importing

import csv, shutil, fileinput

# Import Navbar content
with open('HTML/navbar.html', 'r') as navbarfile:
		navbardata = navbarfile.read()

with open('HTML/generalprojectlink.html', 'r') as projectlinkfile:
	projectlinkdata = projectlinkfile.read()

with open('HTML/generalproject.html', 'r') as generalprojectfile:
	generalfiledata = generalprojectfile.read()
generalfiledata = generalfiledata.replace('IMPORT_NAVBAR', navbardata)

# Insert the navbar
for site in ['about', 'blog', 'index', 'projects']:
		with open('HTML/{0}.html'.format(site), 'r') as sitefile:
			filedata = sitefile.read()
		filedata = filedata.replace('IMPORT_NAVBAR', navbardata)
		with open('../{0}.html'.format(site), 'w') as resultsite:
			resultsite.write(filedata)

# Create the project files
with open('Projects.csv') as csvfile:
	next(csvfile) # Skip first
	csvreader = csv.reader(csvfile)
	projectlinks = ""
	for row in csvreader:
		filedata = generalfiledata.replace('IMPORT_PROJECT_TITLE', row[0])
		filedata = filedata.replace('IMPORT_DESCRIPTION', row[4])
		# Import project files
		projectfiles = row[1].split('&')
		projectstring = ""
		for projectfile in projectfiles:
			projectstring = projectstring + "<script src={0}.js></script>".format(projectfile) + "\n\t"
		filedata = filedata.replace('IMPORT_PROJECT_FILES', projectstring.strip())
		# Import libraries for project
		libraryfiles = row[3].split('&')
		librarystring = ""
		for libraryfile in libraryfiles:
			librarystring = librarystring + "<script src=../libraries/{0}.js></script>".format(libraryfile) + "\n\t"
		filedata = filedata.replace('IMPORT_LIBRARIES', librarystring.strip())
		with open("../projects/{0}.html".format(row[2]), 'w') as file:
			file.write(filedata)
		projectlink = projectlinkdata.replace('IMPORT_PROJECT_FILE', row[2])
		projectlink = projectlink.replace('IMPORT_PROJECT_TITLE', row[0])
		projectlinks = projectlinks + projectlink + "\t\t\t"
	with open("HTML/projects.html", 'r') as projectsfile:
		projectsdata = projectsfile.read()
	projectsdata = projectsdata.replace('IMPORT_PROJECT_LINKS', projectlinks.strip())
	projectsdata = projectsdata.replace('IMPORT_NAVBAR', navbardata)
	with open("../projects.html", 'w') as file:
		file.write(projectsdata)
