# Just a quick script used to convert 'skills.json' into a different format

import json
from itertools import *

def in_array(array, key, category_name):
    for i, item in enumerate(array):
        if key in item and item[key] == category_name:
            return i

with open('derived/skills.json', 'r') as skills:
    data = json.load(skills)

    improved = {}

    improved['name'] = "skills"
    improved['children'] = []

    for skills in data:
        category = skills['category']
        children = improved['children']

        index = in_array(children, 'category', category)
        # create children list if no there already
        if index is None:
            children.append({'category':category, 'children': []})
            index = -1

        grandchildren = children[index]['children']

        index = in_array(grandchildren, 'skill',  skills['skill'])

        if index is None:
            grandchildren.append({'skill':skills['skill'], 'type':skills['type'], 'children':[]})
            index = -1

        greatgrandchildren = grandchildren[index]['children']
        greatgrandchildren.append({'level':skills['level'], 'count':skills['count'], 'user_ids':skills['user_ids']})


    print json.dumps(improved)
