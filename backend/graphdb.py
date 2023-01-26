
#upload to neo4j
def create_concept_node(graph, user_label, concept_label, private, text):
    combined_concept = f"{user_label}-{concept_label}"
    inner_name = f"name:'{combined_concept}', "
    inner_user = f"user:'{user_label}', "
    inner_privacy = f"private:{private}, "
    inner_text = f"text:'{text}'"
    inner_concept_props = f'{{{inner_name+inner_user+inner_privacy+inner_text}}}'
    create_concept = f"CREATE (c:CONCEPT{inner_concept_props})"
    graph.run(create_concept)
    link_cu = f"MATCH (c:CONCEPT{inner_concept_props}), (u:USER{{name:'{user_label}'}}) CREATE (c)-[:CU]->(u)"
    graph.run(link_cu)
    return


def create_entity_nodes(graph,user_label,concept_label,private,entity_list):
    create_arr = []
    combined_concept = f"{user_label}-{concept_label}"
    
    inner_name = f"name:'{combined_concept}', "
    inner_user = f"user:'{user_label}', "
    inner_privacy = f"private:{private}"
    inner_concept_props = f'{{{inner_name+inner_user+inner_privacy}}}'
    
    for i in entity_list:
        inner_name = f"name:'{i}', "
        inner_users = f"users:['{user_label}'], "
        inner_concepts = f"concepts:['{combined_concept}'] "
        inner_props = f'{{{inner_name+inner_users+inner_concepts}}}'
        create_query = f'(:ENTITY{inner_props})'
        create_arr.append(create_query)

    pre_string = ','.join(create_arr)
    nodes_query = 'CREATE '+pre_string
    nodes_query = f"{nodes_query}"
    print(nodes_query)
    graph.run(nodes_query)

    for i in create_arr:
        i = i[:1]+'e' + i[1:]
        match_query = f"MATCH {i}, (c:CONCEPT{inner_concept_props}), (u:USER{{name:'{user_label}'}}) "
        create_query = f"CREATE  (u) <-[:EU]- (e) -[:EC] -> (c)"
        link_entities_to_concept = match_query+create_query
        print(link_entities_to_concept)
        graph.run(link_entities_to_concept)
    return



def create_ee_rel(graph,user_label,concept_label,rel_list):
    combined_concept = f"{user_label}-{concept_label}"
    for i in rel_list:
        obj = i['object']
        subj = i['subject']
        rel = i['relation']
        obj_props = f"{{name:'{obj}', concepts:['{combined_concept}']}}"
        subj_props = f"{{name:'{subj}', concepts:['{combined_concept}']}}"
        rel_query = f"MATCH (o:ENTITY{obj_props}),(s:ENTITY{subj_props}) CREATE (o)-[:EE{{name:'{rel}'}}]->(s)"
        print(rel_query)
        graph.run(rel_query)
    return

def graph_query(graph,user_label,concept_label,private,text,list1,list2):
  merge_entity_nodes_query = "MATCH (n) WITH toLower(n.name) as name, collect(n) as nodes CALL apoc.refactor.mergeNodes(nodes,{properties:{concepts:'combine',users:'combine'},mergeRels:true}) yield node RETURN *"
  merge_eu_rels_query = "MATCH (e:ENTITY)-[r:EU]->(u:USER) WITH r.type as type,[e,u] as eu, collect(r) as rels CALL apoc.refactor.mergeRelationships(rels) yield rel RETURN *"
  merge_ec_rels_query =  "MATCH (e:ENTITY)-[r:EC]->(c:CONCEPT) WITH r.type as type,[e,c] as ec, collect(r) as rels CALL apoc.refactor.mergeRelationships(rels) yield rel RETURN *"
  create_concept_node(graph, user_label, concept_label, private,text)
  create_entity_nodes(graph,user_label,concept_label,private,list1)
  create_ee_rel(graph,user_label,concept_label,list2)
  graph.run(merge_entity_nodes_query)
  graph.run(merge_eu_rels_query)
  graph.run(merge_ec_rels_query)
  print('Uploaded to database!')
  return
