# -*- coding: utf-8 -*-
# from django.shortcuts import render

from django.http import JsonResponse

from wagtail.core.models import Page
from wagtail.documents.models import Document
from wagtail.images.models import Image, Filter
from wagtail.images.shortcuts import get_rendition_or_not_found


def image(request):
    image_id = request.GET.get("id")
    if image_id:
        image_obj = Image.objects.filter(pk=image_id).first()
        if image_obj:
            # Use thumnails for images instead of the actual original full sized images.
            return JsonResponse(
                get_rendition_or_not_found(image_obj, Filter("max-130x130")).url,
                safe=False,
            )

    return JsonResponse(False, safe=False)


def page(request):
    page_id = request.GET.get("id")
    if page_id:
        page_obj = Page.objects.filter(pk=page_id).first()
        if page_obj:
            return JsonResponse(page_obj.title, safe=False)

    return JsonResponse(False, safe=False)


def document(request):
    document_id = request.GET.get("id")

    if document_id:
        document_obj = Document.objects.filter(pk=document_id).first()
        if document_obj:
            return JsonResponse(document_obj.title, safe=False)

    return JsonResponse(False, safe=False)
