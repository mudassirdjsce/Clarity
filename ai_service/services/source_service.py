def attach_sources(response, data):

    sources = []

    if "source" in data:
        sources.append(data["source"])

    if "urls" in data:
        sources.extend(data["urls"])

    response["sources"] = sources

    return response